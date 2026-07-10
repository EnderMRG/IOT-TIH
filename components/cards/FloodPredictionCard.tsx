import { FloodPredictionResult, getRiskColor, getRiskDescription } from '@/lib/flood-model';
import { AlertTriangle, TrendingUp, Info, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { memo } from 'react';

function FloodPredictionCardComponent({ prediction, isLoading }: { prediction: FloodPredictionResult | null, isLoading: boolean }) {
  if (isLoading || !prediction) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[160px] flex flex-col justify-between border border-slate-100 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <div className="w-20 h-6 bg-slate-200 rounded-full" />
        </div>
        <div className="mt-4">
          <div className="w-32 h-8 bg-slate-200 rounded-lg mb-2" />
          <div className="w-24 h-4 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  const riskColor = getRiskColor(prediction.riskLevel);
  const isHighRisk = prediction.riskLevel === 'high' || prediction.riskLevel === 'critical';

  return (
    <div className={cn(
      "rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[160px] flex flex-col justify-between border relative overflow-hidden transition-all duration-300",
      prediction.riskLevel === 'critical' ? "bg-red-50/50 border-red-200 hover:shadow-red-500/20" :
      prediction.riskLevel === 'high' ? "bg-orange-50/50 border-orange-200 hover:shadow-orange-500/20" :
      "bg-white border-slate-100 hover:shadow-blue-500/10"
    )}>
      {/* Background ripple effect for critical */}
      {prediction.riskLevel === 'critical' && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className={cn(
          "p-2.5 rounded-2xl flex items-center justify-center",
          isHighRisk ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
        )}>
          {isHighRisk ? <AlertTriangle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
        </div>
        
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border flex items-center gap-1.5",
          riskColor
        )}>
          {prediction.riskLevel === 'critical' && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 rounded-full bg-red-600"
            />
          )}
          {prediction.riskLevel} RISK
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black tracking-tight text-slate-900">
            {prediction.predictedWaterLevel}
          </span>
          <span className="text-sm font-medium text-slate-500">cm</span>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Predicted in 4h
        </p>
      </div>

      <Link 
        href="/dashboard/predictions" 
        className={cn(
          "mt-5 text-sm font-semibold flex items-center gap-1 group/link w-max",
          isHighRisk ? "text-red-600 hover:text-red-700" : "text-blue-600 hover:text-blue-700"
        )}
      >
        View Forecast Details
        <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
      </Link>
    </div>
  );
}

export const FloodPredictionCard = memo(FloodPredictionCardComponent);
