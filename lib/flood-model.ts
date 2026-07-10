import * as tf from '@tensorflow/tfjs';
import type { TelemetryData } from '@/components/providers/TelemetryProvider';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface FloodPredictionResult {
  predictedWaterLevel: number;
  riskLevel: RiskLevel;
  floodProbability: number;
  hoursAhead: number;
  confidence: number;
  features: { name: string; value: number }[];
  timestamp: string;
}

interface Scalers {
  x_mean: number[];
  x_scale: number[];
  y_mean: number;
  y_scale: number;
  feature_order: string[];
}

interface Config {
  LOOKBACK: number;
  DANGER_THRESHOLD: number;
  features: string[];
}

// ── Custom AttentionLayer ─────────────────────────────────────────────────────
// The Python model uses a custom AttentionLayer that TFJS doesn't know about.
// We must implement it in JS and register it BEFORE calling tf.loadLayersModel.
//
// Architecture (from weights manifest):
//   att_weight: [128, 1]  — applied to BiLSTM output (batch, 48, 128)
//   att_bias:   [48,  1]  — per-timestep bias
//
// Forward pass:
//   scores  = tanh(x @ att_weight + att_bias)   → (batch, 48, 1)
//   weights = softmax(scores, axis=1)            → (batch, 48, 1)
//   context = sum(x * weights, axis=1)           → (batch, 128)

class AttentionLayer extends tf.layers.Layer {
  private attWeight!: tf.LayerVariable;
  private attBias!: tf.LayerVariable;

  static className = 'AttentionLayer';

  constructor(config?: object) {
    super(config || {});
  }

  build(inputShape: tf.Shape | tf.Shape[]) {
    const shape = inputShape as number[];
    const features = shape[shape.length - 1]; // 128 for BiLSTM concat
    const timesteps = shape[shape.length - 2]; // 48

    this.attWeight = this.addWeight(
      'att_weight',
      [features, 1],
      'float32',
      tf.initializers.glorotUniform({})
    );
    this.attBias = this.addWeight(
      'att_bias',
      [timesteps, 1],
      'float32',
      tf.initializers.zeros()
    );
    super.build(inputShape);
  }

  call(inputs: tf.Tensor | tf.Tensor[]): tf.Tensor {
    return tf.tidy(() => {
      const x = Array.isArray(inputs) ? inputs[0] : inputs;
      // x shape: (batch, timesteps, features)

      // scores = tanh(x @ att_weight + att_bias) → (batch, timesteps, 1)
      // tf.matMul broadcasts over the batch dim: (batch,48,128) × (128,1) → (batch,48,1)
      const scores = tf.tanh(tf.add(tf.matMul(x as tf.Tensor3D, this.attWeight.read() as tf.Tensor2D), this.attBias.read()));

      // weights = softmax over timestep axis (axis=1)
      // softmax expects the last axis, so we squeeze the trailing 1, softmax, then expand
      const squeezed = tf.squeeze(scores, [2]); // (batch, timesteps)
      const attnWeights = tf.softmax(squeezed, 1); // (batch, timesteps)
      const expandedWeights = tf.expandDims(attnWeights, 2); // (batch, timesteps, 1)

      // context = sum(x * weights, axis=1) → (batch, features)
      const context = tf.sum(tf.mul(x, expandedWeights), 1);
      return context;
    });
  }

  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape {
    const shape = inputShape as number[];
    // Returns (batch, features) — drops the timestep dimension
    return [shape[0], shape[shape.length - 1]];
  }

  getConfig() {
    return { ...super.getConfig() };
  }
}

// Register the custom layer BEFORE loading the model
tf.serialization.registerClass(AttentionLayer);

// ── Singleton Model State ─────────────────────────────────────────────────────

let _model: tf.LayersModel | null = null;
let _scalers: Scalers | null = null;
let _config: Config | null = null;
let _isLoading = false;

// ── Initialization ────────────────────────────────────────────────────────────

// Maps each layer name → ordered list of manifest weight names for that layer.
// This must match the order that TFJS assigns weights within each layer.
const LAYER_WEIGHT_KEYS: Record<string, string[]> = {
  conv1d_1: ['conv1d_1/kernel', 'conv1d_1/bias'],
  batch_normalization_1: [
    'batch_normalization_1/gamma',
    'batch_normalization_1/beta',
    'batch_normalization_1/moving_mean',
    'batch_normalization_1/moving_variance',
  ],
  // Bidirectional exposes forward+backward weights combined, in forward-first order.
  bidirectional_1: [
    'bidirectional_1/forward_lstm_1/kernel',
    'bidirectional_1/forward_lstm_1/recurrent_kernel',
    'bidirectional_1/forward_lstm_1/bias',
    'bidirectional_1/backward_lstm_1/kernel',
    'bidirectional_1/backward_lstm_1/recurrent_kernel',
    'bidirectional_1/backward_lstm_1/bias',
  ],
  // Custom layer — weights registered via addWeight in build()
  attention_weights: ['attention_weights/att_weight', 'attention_weights/att_bias'],
  dense_2: ['dense_2/kernel', 'dense_2/bias'],
  dense_3: ['dense_3/kernel', 'dense_3/bias'],
};

export async function loadModel(): Promise<void> {
  if (_model) return;
  if (_isLoading) {
    while (_isLoading) await new Promise(r => setTimeout(r, 100));
    return;
  }

  try {
    _isLoading = true;

    // 1. Load config & scalers
    const [configRes, scalersRes, modelJsonRes, binRes] = await Promise.all([
      fetch('/model_config.json'),
      fetch('/model_scalers.json'),
      fetch('/tfjs_model/model.json'),
      fetch('/tfjs_model/group1-shard1of1.bin'),
    ]);

    if (!configRes.ok || !scalersRes.ok || !modelJsonRes.ok || !binRes.ok) {
      throw new Error('Failed to fetch model assets');
    }

    _config   = await configRes.json();
    _scalers  = await scalersRes.json();
    const modelJson = await modelJsonRes.json();
    const binBuffer = await binRes.arrayBuffer();

    // 2. Parse all weights from the binary file using the manifest's dtype/shape info.
    //    Weights are stored back-to-back as Float32 in manifest order.
    const manifest: Array<{ name: string; shape: number[]; dtype: string }> =
      modelJson.weightsManifest[0].weights;

    const weightDict: Record<string, tf.Tensor> = {};
    let byteOffset = 0;

    for (const spec of manifest) {
      const numElements = spec.shape.reduce((a: number, b: number) => a * b, 1);
      const float32Data = new Float32Array(binBuffer, byteOffset, numElements);
      // Clone into a plain array so the view doesn't hold a reference to the entire buffer
      weightDict[spec.name] = tf.tensor(Array.from(float32Data), spec.shape, 'float32');
      byteOffset += numElements * 4; // 4 bytes per float32
    }

    // 3. Load model TOPOLOGY ONLY — no weight loading, so naming never matters.
    const topoArtifacts = {
      modelTopology: modelJson.modelTopology,
      format: 'layers-model' as const,
      generatedBy: 'manual',
      convertedBy: null,
    };
    _model = await tf.loadLayersModel(tf.io.fromMemory(topoArtifacts));

    // 4. Assign weights layer-by-layer using setWeights() — positional, not name-based.
    //    This bypasses TFJS internal variable naming entirely.
    for (const [layerName, keys] of Object.entries(LAYER_WEIGHT_KEYS)) {
      try {
        const layer = _model.getLayer(layerName);
        const tensors = keys.map(k => {
          const t = weightDict[k];
          if (!t) throw new Error(`Missing weight in manifest: "${k}"`);
          return t;
        });
        layer.setWeights(tensors);
      } catch (layerErr) {
        // Log what the layer actually expects for easier debugging
        const layer = _model.getLayer(layerName);
        console.error(`[FloodModel] setWeights failed for "${layerName}". Layer expects:`,
          layer.weights.map(w => `${w.name} ${JSON.stringify(w.shape)}`));
        throw layerErr;
      }
    }

    // Dispose parsed tensors — model now owns its own weight copies
    Object.values(weightDict).forEach(t => t.dispose());

    console.log('[FloodModel] Loaded and weights set successfully ✅');

  } catch (err) {
    console.error('[FloodModel] Error loading model:', err);
    _model = null; // reset so next call retries
    throw err;
  } finally {
    _isLoading = false;
  }
}

// ── Feature Engineering ───────────────────────────────────────────────────────

/**
 * Creates cyclical features and extracts required values from raw telemetry
 * Important: Needs 48 consecutive hours of data, ending with the most recent.
 */
function engineerFeatures(history: TelemetryData[], scalers: Scalers): number[][] {
  return history.map((reading, i) => {
    const d = new Date(reading.timestamp);
    const hour = d.getHours();
    const month = d.getMonth() + 1; // 1-12

    // Cyclical encodings
    const hour_sin = Math.sin(2 * Math.PI * hour / 24);
    const hour_cos = Math.cos(2 * Math.PI * hour / 24);
    const month_sin = Math.sin(2 * Math.PI * month / 12);
    const month_cos = Math.cos(2 * Math.PI * month / 12);

    // Rate of change (cm/hr) - simplified to diff from previous hour
    // If it's the first reading, assume 0 rate of change
    let rate_of_change_cm_per_hr = 0;
    if (i > 0) {
      rate_of_change_cm_per_hr = reading.distance - history[i - 1].distance;
    }

    // 3h trends
    let pressure_trend_3h = 0;
    let humidity_trend_3h = 0;
    if (i >= 3) {
      pressure_trend_3h = reading.pressure - history[i - 3].pressure;
      humidity_trend_3h = reading.humidity - history[i - 3].humidity;
    }

    // Must match feature_order precisely
    const rawFeatures: Record<string, number> = {
      hour_sin,
      hour_cos,
      month_sin,
      month_cos,
      temperature_c: reading.temperature,
      humidity_percent: reading.humidity,
      pressure_hpa: reading.pressure,
      pressure_trend_3h,
      humidity_trend_3h,
      water_level_cm: reading.distance,
      rate_of_change_cm_per_hr,
    };

    // Construct ordered feature array and normalize using StandardScaler (x - mean) / scale
    return scalers.feature_order.map((featName, featIdx) => {
      const val = rawFeatures[featName] || 0;
      const mean = scalers.x_mean[featIdx];
      const scale = scalers.x_scale[featIdx];
      return (val - mean) / scale;
    });
  });
}

// ── Inference ─────────────────────────────────────────────────────────────────

export async function predictFloodRisk(history: TelemetryData[]): Promise<FloodPredictionResult> {
  await loadModel();

  if (!_model || !_scalers || !_config) {
    throw new Error("Model not properly loaded");
  }

  // Ensure we have exactly LOOKBACK items (usually 48)
  const LOOKBACK = _config.LOOKBACK;
  if (history.length < LOOKBACK) {
    throw new Error(`Insufficient data: Need ${LOOKBACK} readings, got ${history.length}`);
  }
  
  // Take only the last 48 readings
  const recentHistory = history.slice(-LOOKBACK);
  
  // 1. Engineer and scale features
  // shape: [48, 11]
  const features2D = engineerFeatures(recentHistory, _scalers);
  
  // 2. Convert to Tensor with shape [1, 48, 11] (batch_size, timesteps, features)
  const inputTensor = tf.tensor3d([features2D], [1, LOOKBACK, _scalers.feature_order.length]);

  // 3. Run inference
  const outputTensor = _model.predict(inputTensor) as tf.Tensor;
  
  // 4. Extract scalar prediction
  const normalizedPred = (await outputTensor.data())[0];
  
  // Cleanup tensors
  inputTensor.dispose();
  outputTensor.dispose();

  // 5. Denormalize prediction (y = normalized * scale + mean)
  const predictedWaterLevel = (normalizedPred * _scalers.y_scale) + _scalers.y_mean;

  // 6. Calculate risk metrics
  const DANGER = _config.DANGER_THRESHOLD;
  const currentLevel = recentHistory[recentHistory.length - 1].distance;
  
  // Risk levels based on how close we are to 450cm
  let riskLevel: RiskLevel = 'low';
  let floodProbability = 0;
  
  if (predictedWaterLevel >= DANGER) {
    riskLevel = 'critical';
    floodProbability = 99;
  } else if (predictedWaterLevel >= DANGER - 50) {
    riskLevel = 'high';
    floodProbability = 75 + ((predictedWaterLevel - (DANGER - 50)) / 50) * 20; // 75-95%
  } else if (predictedWaterLevel >= DANGER - 150) {
    riskLevel = 'moderate';
    floodProbability = 30 + ((predictedWaterLevel - (DANGER - 150)) / 100) * 45; // 30-75%
  } else {
    riskLevel = 'low';
    floodProbability = Math.max(1, (predictedWaterLevel / (DANGER - 150)) * 30); // 1-30%
  }

  // Cap prob
  floodProbability = Math.min(99.9, Math.max(0.1, floodProbability));

  // Determine which features are driving the change (simplified mock logic for UI)
  const latestRaw = recentHistory[recentHistory.length - 1];
  const featureContributions = [
    { name: 'Water Level', value: latestRaw.distance },
    { name: 'Temperature', value: latestRaw.temperature },
    { name: 'Humidity', value: latestRaw.humidity },
    { name: 'Pressure', value: latestRaw.pressure },
  ];

  return {
    predictedWaterLevel: Math.round(predictedWaterLevel * 10) / 10,
    riskLevel,
    floodProbability: Math.round(floodProbability * 10) / 10,
    hoursAhead: 4, // Model is trained to predict 4 hours out
    confidence: 85 + Math.random() * 10, // Simulated confidence interval 85-95%
    features: featureContributions,
    timestamp: new Date().toISOString()
  };
}

// ── Risk Helpers ──────────────────────────────────────────────────────────────

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    case 'high':     return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low':      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  }
}

export function getRiskDescription(risk: RiskLevel): string {
  switch (risk) {
    case 'critical': return 'Critical danger. Flooding is highly likely or already occurring. Evacuate immediately.';
    case 'high':     return 'High risk. Water levels are rising rapidly towards danger thresholds. Prepare for potential evacuation.';
    case 'moderate': return 'Moderate risk. Elevated water levels detected. Stay alert for updates and changing weather.';
    case 'low':      return 'Low risk. Conditions are normal. No immediate threat of flooding.';
  }
}
