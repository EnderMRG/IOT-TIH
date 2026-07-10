"use client";

import { useTelemetry } from '@/components/providers/TelemetryProvider';
import { useFloodPrediction } from '@/hooks/useFloodPrediction';
import { AlertTriangle, Clock, Activity, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function FloodAlertBanner() {
  const { history } = useTelemetry();
  const { prediction } = useFloodPrediction(history);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show for high or critical risk
    if (prediction && (prediction.riskLevel === 'high' || prediction.riskLevel === 'critical')) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [prediction]);

  if (!prediction || !isVisible) return null;

  const isCritical = prediction.riskLevel === 'critical';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "w-full rounded-2xl p-4 md:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden",
          isCritical 
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-600/30" 
            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30"
        )}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        
        {/* Pulsing glow for critical */}
        {isCritical && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-500 pointer-events-none mix-blend-overlay"
          />
        )}

        <div className={cn(
          "p-3 rounded-xl shrink-0 relative z-10",
          isCritical ? "bg-white/20" : "bg-white/20"
        )}>
          {isCritical ? <ShieldAlert className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
        </div>

        <div className="flex-1 relative z-10 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg leading-tight uppercase tracking-wide">
              {isCritical ? "CRITICAL FLOOD WARNING" : "HIGH FLOOD RISK"}
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/20">
              AI FORECAST
            </span>
          </div>
          <p className="text-white/90 text-sm md:text-base leading-snug">
            Water level predicted to reach <strong className="text-white">{prediction.predictedWaterLevel} cm</strong> in approx. 4 hours.
            {isCritical 
              ? " This exceeds safe limits (450cm). Evacuation protocols may be necessary." 
              : " This is approaching dangerous levels (450cm). Monitor conditions closely."}
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 relative z-10">
          <Link 
            href="/dashboard/predictions"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            View Forecast <ArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
