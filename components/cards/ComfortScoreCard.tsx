"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface ComfortScoreCardProps {
  temperature: number;
  humidity: number;
}

function computeScore(temp: number, humidity: number): number {
  // Simple comfort index: ideal is 22-24°C, 40-60% humidity
  const tempScore = Math.max(0, 100 - Math.abs(temp - 23) * 6);
  const humScore = Math.max(0, 100 - Math.abs(humidity - 50) * 1.5);
  return Math.round((tempScore * 0.6 + humScore * 0.4));
}

function getLabel(score: number): { label: string; color: string; bg: string; textColor: string } {
  if (score >= 85) return { label: "Excellent", color: "#22c55e", bg: "bg-emerald-50", textColor: "text-emerald-700" };
  if (score >= 65) return { label: "Good",      color: "#355441", bg: "bg-green-50",   textColor: "text-green-700" };
  if (score >= 40) return { label: "Moderate",  color: "#f59e0b", bg: "bg-yellow-50",  textColor: "text-yellow-700" };
  return              { label: "Poor",      color: "#ef4444", bg: "bg-red-50",     textColor: "text-red-700" };
}

function ComfortScoreCardComponent({ temperature, humidity }: ComfortScoreCardProps) {
  const score = computeScore(temperature, humidity);
  const { label, color, bg, textColor } = getLabel(score);

  const radius = 52;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden min-h-[220px]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
      
      {/* Header */}
      <div className="flex justify-between items-start relative z-10 w-full">
        <h3 className="text-slate-900 font-bold text-base">Comfort Score</h3>
        <span className={cn("px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border flex items-center gap-1.5", bg, textColor, "border-current/20")}>
          {label}
        </span>
      </div>

      {/* SVG Ring */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-6">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke="#e4e1d8"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black tracking-tight text-slate-900">{score}</span>
            <span className="text-sm font-medium text-slate-500">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ComfortScoreCard = memo(ComfortScoreCardComponent);
