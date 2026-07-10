"use client";

import { FloodPredictionResult, getRiskDescription } from '@/lib/flood-model';
import { CustomLineChart } from '@/components/charts/CustomLineChart';
import { TelemetryData } from '@/components/providers/TelemetryProvider';
import { AlertTriangle, Info, MapPin, Activity, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloodPredictionPanelProps {
  prediction: FloodPredictionResult | null;
  history: TelemetryData[];
  isLoading: boolean;
  isAdmin: boolean;
}

// Risk level → rich gradient config
function getRiskGradient(level: string) {
  switch (level) {
    case 'critical': return 'from-red-700 via-red-600 to-rose-500';
    case 'high':     return 'from-orange-600 via-orange-500 to-amber-400';
    case 'moderate': return 'from-[#1a3a5c] via-[#1e4976] to-[#1d6fa8]';
    default:         return 'from-emerald-700 via-emerald-600 to-teal-500';
  }
}

function getRiskAccent(level: string) {
  switch (level) {
    case 'critical': return 'from-red-400 via-rose-300 to-transparent';
    case 'high':     return 'from-orange-400 via-amber-300 to-transparent';
    case 'moderate': return 'from-blue-400 via-sky-300 to-transparent';
    default:         return 'from-emerald-400 via-teal-300 to-transparent';
  }
}

function getRiskBadge(level: string) {
  switch (level) {
    case 'critical': return 'bg-red-900/40 border-red-400/30 text-red-100';
    case 'high':     return 'bg-orange-900/40 border-orange-400/30 text-orange-100';
    case 'moderate': return 'bg-blue-900/30 border-sky-400/30 text-sky-100';
    default:         return 'bg-emerald-900/40 border-emerald-400/30 text-emerald-100';
  }
}

export function FloodPredictionPanel({ prediction, history, isLoading, isAdmin }: FloodPredictionPanelProps) {
  const chartData = useMemo(() => {
    if (!history.length || isLoading) return [];
    const baseData = history.slice(-24).map((e) => ({
      time: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      distance: e.distance,
      isPrediction: false,
    }));
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
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[2rem] p-8 min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Activity className="w-12 h-12 animate-pulse" />
          <p className="font-medium animate-pulse">Running AI Forecast Models...</p>
        </div>
      </div>
    );
  }

  const isHighRisk = prediction.riskLevel === 'high' || prediction.riskLevel === 'critical';

  return (
    <div className="flex flex-col gap-6">

      {/* 1. Main Risk Hero Card */}
      <div className={cn(
        "relative rounded-[2rem] p-8 md:p-10 overflow-hidden bg-gradient-to-br shadow-2xl",
        getRiskGradient(prediction.riskLevel)
      )}>
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        {/* Top accent shimmer */}
        <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", getRiskAccent(prediction.riskLevel))} />
        {/* Glass inner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            {/* Risk level icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                {isHighRisk ? <AlertTriangle className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">AI Risk Assessment</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
              {prediction.riskLevel} RISK
            </h2>
            <p className="text-base md:text-lg font-medium text-white/80 max-w-2xl leading-relaxed">
              {getRiskDescription(prediction.riskLevel)}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm text-sm font-semibold text-white", getRiskBadge(prediction.riskLevel))}>
                <MapPin className="w-4 h-4 opacity-75" />
                <span>Assam, Brahmaputra River Basin</span>
              </div>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm text-sm font-semibold text-white", getRiskBadge(prediction.riskLevel))}>
                <Zap className="w-4 h-4 opacity-75" />
                <span>{prediction.confidence.toFixed(1)}% Confidence</span>
              </div>
            </div>
          </div>

          {/* Forecast box */}
          <div className="flex flex-col items-center justify-center p-7 bg-white/10 border border-white/20 rounded-[1.5rem] backdrop-blur-sm text-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">4hr Forecast</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tracking-tighter text-white">{prediction.predictedWaterLevel}</span>
              <span className="text-xl font-bold text-white/70">cm</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (prediction.predictedWaterLevel / 500) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Danger threshold: 450cm</span>
          </div>
        </div>
      </div>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Forecast Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[2rem] p-6 min-h-[400px] flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Water Level Forecast</h3>
              <p className="text-sm text-slate-500">Historical data plus AI prediction</p>
            </div>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
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
            <div className="absolute top-[10%] left-0 right-0 border-t-2 border-dashed border-red-500/50 pointer-events-none" />
            <span className="absolute top-[10%] right-4 -translate-y-full text-xs font-bold text-red-500/80">
              DANGER (450cm)
            </span>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          {/* Recommendations */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-6 text-white shadow-lg overflow-hidden border border-white/10">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="p-2 bg-white/10 rounded-xl border border-white/10">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Recommendations</h3>
            </div>
            <ul className="space-y-4 relative z-10">
              {prediction.riskLevel === 'critical' ? (
                <>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-red-400 font-bold">1.</span> Execute emergency evacuation plan immediately.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-red-400 font-bold">2.</span> Move essential supplies to higher ground.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-red-400 font-bold">3.</span> Follow local authority instructions.</li>
                </>
              ) : prediction.riskLevel === 'high' ? (
                <>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-orange-400 font-bold">1.</span> Prepare emergency kits and evacuation routes.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-orange-400 font-bold">2.</span> Secure loose outdoor items.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-orange-400 font-bold">3.</span> Monitor local news and dashboard updates closely.</li>
                </>
              ) : (
                <>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-sky-400 font-bold">1.</span> Conditions are currently stable.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-sky-400 font-bold">2.</span> Ensure sensors remain online for continuous monitoring.</li>
                  <li className="flex gap-3 text-sm text-white/85"><span className="text-sky-400 font-bold">3.</span> Review general flood preparedness guidelines.</li>
                </>
              )}
            </ul>
          </div>

          {/* Admin Feature Importance */}
          {isAdmin && (
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[2rem] p-6 flex-1 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Model Feature Weights</h3>
                <span className="text-xs text-slate-400 font-mono font-medium px-2 py-0.5 bg-slate-100 rounded-full">ADMIN</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Water Level History', pct: 72, color: 'bg-blue-600', text: 'text-blue-600' },
                  { label: 'Atmospheric Pressure (Trend)', pct: 15, color: 'bg-indigo-500', text: 'text-indigo-500' },
                  { label: 'Humidity Levels', pct: 8, color: 'bg-teal-500', text: 'text-teal-500' },
                  { label: 'Time of Year / Cyclical', pct: 5, color: 'bg-slate-300', text: 'text-slate-400' },
                ].map(({ label, pct, color, text }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">{label}</span>
                      <span className={text}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
