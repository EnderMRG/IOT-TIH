"use client";

import { FloodPredictionResult, getRiskDescription } from '@/lib/flood-model';
import { CustomLineChart } from '@/components/charts/CustomLineChart';
import { TelemetryData } from '@/components/providers/TelemetryProvider';
import { AlertTriangle, Info, MapPin, Activity, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloodPredictionPanelProps {
  prediction: FloodPredictionResult | null;
  history: TelemetryData[];
  isLoading: boolean;
  isAdmin: boolean;
}

export function FloodPredictionPanel({ prediction, history, isLoading, isAdmin }: FloodPredictionPanelProps) {
  // Memoize chart data generation
  const chartData = useMemo(() => {
    if (!history.length || isLoading) return [];

    // Map history to chart format
    const baseData = history.slice(-24).map((e) => ({
      time: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      distance: e.distance,
      isPrediction: false,
    }));

    // Add prediction point 4 hours ahead if available
    if (prediction) {
      const lastTime = new Date(history[history.length - 1].timestamp);
      const predTime = new Date(lastTime.getTime() + prediction.hoursAhead * 60 * 60 * 1000);
      
      baseData.push({
        time: predTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (Est)",
        distance: prediction.predictedWaterLevel,
        isPrediction: true,
      });
    }

    return baseData;
  }, [history, prediction, isLoading]);

  if (isLoading || !prediction) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Activity className="w-12 h-12 animate-pulse" />
          <p className="font-medium animate-pulse">Running AI Forecast Models...</p>
        </div>
      </div>
    );
  }

  const isHighRisk = prediction.riskLevel === 'high' || prediction.riskLevel === 'critical';

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. Main Risk Header */}
      <div className={cn(
        "rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden transition-colors duration-500",
        prediction.riskLevel === 'critical' ? "bg-red-600 text-white" :
        prediction.riskLevel === 'high' ? "bg-orange-500 text-white" :
        prediction.riskLevel === 'moderate' ? "bg-amber-400 text-slate-900" :
        "bg-emerald-500 text-white"
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              {prediction.riskLevel} RISK
            </h2>
            <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl leading-relaxed">
              {getRiskDescription(prediction.riskLevel)}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <MapPin className="w-5 h-5 opacity-75" />
                <span className="font-semibold">Assam, Brahmaputra River Basin</span>
              </div>
              <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Activity className="w-5 h-5 opacity-75" />
                <span className="font-semibold">{prediction.confidence.toFixed(1)}% Confidence</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-black/10 rounded-3xl backdrop-blur-sm text-center">
            <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">4hr Forecast</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tracking-tighter">{prediction.predictedWaterLevel}</span>
              <span className="text-xl font-bold opacity-80">cm</span>
            </div>
            <div className="mt-4 w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (prediction.predictedWaterLevel / 500) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide opacity-75 mt-2">Danger threshold: 450cm</span>
          </div>
        </div>
      </div>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Water Level Forecast</h3>
              <p className="text-sm text-slate-500">Historical data plus AI prediction</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
              TensorFlow.js CNN-BiLSTM
            </span>
          </div>
          <div className="flex-1 relative">
            <CustomLineChart 
              data={chartData} 
              dataKey="distance" 
              color={isHighRisk ? "#ef4444" : "#3b82f6"} 
              label="Water Level (cm)" 
            />
            {/* Danger Line Overlay */}
            <div className="absolute top-[10%] left-0 right-0 border-t-2 border-dashed border-red-500/50 pointer-events-none" />
            <span className="absolute top-[10%] right-4 -translate-y-full text-xs font-bold text-red-500/80">
              DANGER (450cm)
            </span>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          {/* Action Recommendations */}
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Recommendations</h3>
            </div>
            <ul className="space-y-4">
              {prediction.riskLevel === 'critical' ? (
                <>
                  <li className="flex gap-3 text-sm">
                    <span className="text-red-400">1.</span> Execute emergency evacuation plan immediately.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-red-400">2.</span> Move essential supplies to higher ground.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-red-400">3.</span> Follow local authority instructions.
                  </li>
                </>
              ) : prediction.riskLevel === 'high' ? (
                <>
                  <li className="flex gap-3 text-sm">
                    <span className="text-orange-400">1.</span> Prepare emergency kits and evacuation routes.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-orange-400">2.</span> Secure loose outdoor items.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-orange-400">3.</span> Monitor local news and dashboard updates closely.
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-3 text-sm">
                    <span className="text-blue-400">1.</span> Conditions are currently stable.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-blue-400">2.</span> Ensure sensors remain online for continuous monitoring.
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-blue-400">3.</span> Review general flood preparedness guidelines.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Admin Feature Importance (Mocked visually based on history) */}
          {isAdmin && (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Model Feature Weights</h3>
                <span className="text-xs text-slate-400 font-medium font-mono">ADMIN</span>
              </div>
              <div className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Water Level History</span>
                    <span className="text-blue-600">72%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[72%] rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Atmospheric Pressure (Trend)</span>
                    <span className="text-indigo-500">15%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[15%] rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Humidity Levels</span>
                    <span className="text-teal-500">8%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[8%] rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Time of Year / Cyclical</span>
                    <span className="text-slate-400">5%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 w-[5%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
