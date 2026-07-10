/**
 * patch_model.js
 * Converts a Keras 3 TFJS export to be compatible with the TFJS Keras 2 loader.
 *
 * Keras 3 changes vs Keras 2 that break TFJS:
 *  1. InputLayer config uses "batch_shape" instead of "batchInputShape"
 *  2. inbound_nodes use objects {args: [__keras_tensor__...], kwargs: {...}} instead of flat arrays
 *  3. input_layers / output_layers are flat [name, node, tensor] instead of [[name, node, tensor]]
 *  4. inbound_nodes inner arrays had an extra {} kwargs element that confuses TFJS
 *  5. DTypePolicy dicts for dtype instead of plain strings confuse some layers
 */

const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, 'public', 'tfjs_model', 'model.json');
const raw = fs.readFileSync(modelPath, 'utf8');
const model = JSON.parse(raw);

const config = model.modelTopology.model_config.config;

// ── Fix 1: input_layers / output_layers ─────────────────────────────────────
// Keras 3: ["input_layer_1", 0, 0]      (flat array)
// Keras 2: [["input_layer_1", 0, 0]]    (array of arrays)
function fixLayerRef(ref) {
  if (!Array.isArray(ref)) return ref;
  // Already wrapped
  if (Array.isArray(ref[0])) return ref;
  return [ref];
}

config.input_layers = fixLayerRef(config.input_layers);
config.output_layers = fixLayerRef(config.output_layers);

// ── Fix 2 & 4: inbound_nodes per layer ──────────────────────────────────────
// Keras 3: [{args: [{class_name:"__keras_tensor__", config:{keras_history:[name,n,t]}}], kwargs:{}}]
// Keras 2: [[[name, n, t]]]   (no kwargs, no wrapper objects)
function convertInboundNodes(nodes) {
  if (!nodes || nodes.length === 0) return [];

  // If already in Keras 2 format (inner element is an array), just strip the extra {}
  if (Array.isArray(nodes[0]) && Array.isArray(nodes[0][0])) {
    return nodes.map(nodeGroup =>
      nodeGroup.map(entry => {
        // Remove trailing {} if present: [name, n, t, {}] → [name, n, t]
        if (entry.length === 4 && typeof entry[3] === 'object' && !Array.isArray(entry[3])) {
          return entry.slice(0, 3);
        }
        return entry;
      })
    );
  }

  // Keras 3 format — convert to Keras 2
  return nodes.map(node => {
    const args = node.args || [];
    const converted = [];
    for (const arg of args) {
      if (arg.class_name === '__keras_tensor__' && arg.config && arg.config.keras_history) {
        const [layer_name, node_index, tensor_index] = arg.config.keras_history;
        converted.push([layer_name, node_index, tensor_index]);
      }
    }
    return converted;
  }).filter(arr => arr.length > 0);
}

for (const layer of config.layers) {
  if (layer.inbound_nodes !== undefined) {
    layer.inbound_nodes = convertInboundNodes(layer.inbound_nodes);
  }

  // ── Fix 3: InputLayer batchInputShape ─────────────────────────────────────
  if (layer.class_name === 'InputLayer' && layer.config) {
    if (layer.config.batch_shape && !layer.config.batchInputShape) {
      layer.config.batchInputShape = layer.config.batch_shape;
      delete layer.config.batch_shape;
    }
    // Remove unknown fields that confuse TFJS
    delete layer.config.optional;
    delete layer.config.ragged;
  }

  // ── Fix 5: dtype — TFJS wants a plain string, not a DTypePolicy dict ──────
  if (layer.config && layer.config.dtype && typeof layer.config.dtype === 'object') {
    // e.g. {"module":"keras","class_name":"DTypePolicy","config":{"name":"float32"}}
    layer.config.dtype = layer.config.dtype?.config?.name ?? 'float32';
  }
}

// ── Fix 6: Weight name paths in weightsManifest ──────────────────────────────
// Keras 3 stores LSTM weights under an lstm_cell/ sub-scope:
//   "bidirectional_1/forward_lstm_1/lstm_cell/kernel"
// TFJS (Keras 2) expects them directly on the LSTM layer:
//   "bidirectional_1/forward_lstm_1/kernel"
for (const manifest of model.weightsManifest) {
  for (const weight of manifest.weights) {
    // Strip /lstm_cell/ from any LSTM weight path
    weight.name = weight.name.replace(/\/lstm_cell\//g, '/');
  }
}

console.log('Weight names after fix:');
model.weightsManifest[0].weights.forEach(w => console.log(' ', w.name));

fs.writeFileSync(modelPath, JSON.stringify(model), 'utf8');
console.log('✅ model.json patched successfully for TFJS Keras 2 compatibility.');

