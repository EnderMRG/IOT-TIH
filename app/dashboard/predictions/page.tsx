"use client";

import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { useFloodPrediction } from "@/hooks/useFloodPrediction";
import { FloodPredictionPanel } from "@/components/cards/FloodPredictionPanel";
import { BrainCircuit, Database, Server, Settings2 } from "lucide-react";

export default function PredictionsPage() {
  const { history, userRole } = useTelemetry();
  const { prediction, isLoading, error } = useFloodPrediction(history);

  const isAdmin = userRole === "admin";

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">AI Analytics Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Flood Forecasting</h2>
          <p className="text-slate-500 text-base mt-2 max-w-2xl">
            Powered by a deep learning CNN-BiLSTM-Attention network. The model analyzes the last 48 hours of sensor telemetry to predict water levels 4 hours into the future.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200">
          <h3 className="font-bold text-lg mb-1">Model Loading Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <FloodPredictionPanel 
          prediction={prediction} 
          history={history} 
          isLoading={isLoading} 
          isAdmin={isAdmin}
        />
      )}

      {/* Admin Extra Tools */}
      {isAdmin && (
        <div className="mt-8 border-t border-slate-200 pt-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-400" />
            Model Diagnostics &amp; Admin Controls
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model Architecture */}
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[2rem] p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
              <div className="flex items-center gap-3 mb-4 text-slate-700">
                <Database className="w-5 h-5" />
                <h4 className="font-bold">Model Architecture</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Type:</span> <span className="font-mono font-medium text-slate-900">CNN-BiLSTM-Att</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Input Shape:</span> <span className="font-mono font-medium text-slate-900">[48, 11]</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Output:</span> <span className="font-mono font-medium text-slate-900">4hr Forecast</span>
                </li>
                <li className="flex justify-between pt-1">
                  <span>MAE (Train):</span> <span className="font-mono font-medium text-emerald-600">3.42 cm</span>
                </li>
              </ul>
            </div>

            {/* Inference Engine */}
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[2rem] p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
              <div className="flex items-center gap-3 mb-4 text-slate-700">
                <Server className="w-5 h-5" />
                <h4 className="font-bold">Inference Engine</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Provider:</span> <span className="font-mono font-medium text-slate-900">TensorFlow.js (WebGL)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Status:</span> 
                  <span className={isLoading ? "text-amber-500 font-bold" : "text-emerald-600 font-bold"}>
                    {isLoading ? "COMPUTING..." : "READY"}
                  </span>
                </li>
                <li className="flex justify-between pt-1">
                  <span>Last Run:</span> 
                  <span className="font-mono text-xs mt-0.5 text-slate-500">
                    {prediction ? new Date(prediction.timestamp).toLocaleTimeString() : "Never"}
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Settings CTA — dark card with functional link */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center gap-4 overflow-hidden border border-white/10 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 relative z-10">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-white/60 relative z-10">
                Modify prediction thresholds and run tests in the Settings panel.
              </p>
              <a
                href="/dashboard/settings"
                className="relative z-10 px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-full text-sm hover:bg-slate-100 transition-colors shadow-sm"
              >
                Open Settings
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
