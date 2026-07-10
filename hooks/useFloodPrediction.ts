"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryData } from '@/components/providers/TelemetryProvider';
import { predictFloodRisk, FloodPredictionResult, loadModel } from '@/lib/flood-model';

interface UseFloodPredictionReturn {
  prediction: FloodPredictionResult | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  runPrediction: (history: TelemetryData[]) => Promise<void>;
}

export function useFloodPrediction(history: TelemetryData[]): UseFloodPredictionReturn {
  const [prediction, setPrediction] = useState<FloodPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true); // initially true while model loads
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastHistoryRef = useRef<string>("");
  const sampleDataRef = useRef<any[] | null>(null);

  // 1. Initialize Model & load sample data for padding
  useEffect(() => {
    let mounted = true;
    
    async function init() {
      try {
        setIsLoading(true);
        await loadModel();
        
        // Also fetch sample data for padding if history < 48
        const res = await fetch('/sample_data.json');
        if (res.ok) {
          sampleDataRef.current = await res.json();
        }
        
        if (mounted) {
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to init flood model:", err);
          setError("Failed to load prediction model");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    
    init();
    return () => { mounted = false; };
  }, []);

  // 2. The core prediction function
  const runPrediction = useCallback(async (currentHistory: TelemetryData[]) => {
    if (!isReady || currentHistory.length === 0) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      let inputData = [...currentHistory];
      
      // We need 48 hours of data. If we don't have enough, pad with sample data.
      if (inputData.length < 48 && sampleDataRef.current) {
        const needed = 48 - inputData.length;
        // Take the last `needed` items from sample data that are NOT in the current history
        // For simplicity, just grab the last `needed` items from sample data
        const padding = sampleDataRef.current.slice(-needed).map(d => ({
          temperature: d.temperature_c,
          humidity: d.humidity_percent,
          pressure: d.pressure_hpa,
          altitude: 0, // not used by model
          distance: d.water_level_cm, 
          timestamp: new Date(`${d.date}T${d.time}`).toISOString()
        }));
        
        inputData = [...padding, ...inputData];
      }
      
      // If we STILL don't have 48 (e.g. sample data failed to load), we can't predict
      if (inputData.length < 48) {
        throw new Error("Insufficient data for prediction (needs 48h)");
      }

      const result = await predictFloodRisk(inputData);
      setPrediction(result);
      
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to run prediction");
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  // 3. Auto-run prediction when history changes
  useEffect(() => {
    if (!isReady || history.length === 0) return;
    
    // Simple deep equality check to avoid re-running if data hasn't actually changed
    const historyString = JSON.stringify(history.map(h => h.timestamp + h.distance));
    if (historyString === lastHistoryRef.current) return;
    
    lastHistoryRef.current = historyString;
    runPrediction(history);
  }, [history, isReady, runPrediction]);

  return {
    prediction,
    isLoading,
    isReady,
    error,
    runPrediction
  };
}
