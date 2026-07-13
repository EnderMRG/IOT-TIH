"use client";

import { memo, useEffect } from "react";
import {
  Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog,
  Wind, Droplets, Thermometer, MapPin, RefreshCw, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";
import type { WeatherData } from "@/app/api/weather/route";
import { useTelemetry } from "@/components/providers/TelemetryProvider";

// ── Condition Icon ───────────────────────────────────────────────────────────

function ConditionIcon({
  group,
  className,
}: {
  group: WeatherData["current"]["conditionGroup"];
  className?: string;
}) {
  const props = { className: cn("shrink-0", className) };
  switch (group) {
    case "clear":  return <Sun {...props} />;
    case "cloudy": return <Cloud {...props} />;
    case "rain":   return <CloudRain {...props} />;
    case "storm":  return <CloudLightning {...props} />;
    case "snow":   return <CloudSnow {...props} />;
    case "fog":    return <CloudFog {...props} />;
    default:       return <Cloud {...props} />;
  }
}

// ── Flood Risk Config ────────────────────────────────────────────────────────

function getRiskConfig(risk: WeatherData["floodRiskContext"]) {
  switch (risk) {
    case "critical":
      return {
        bar: "bg-red-500",
        pill: "bg-red-100 text-red-700 border-red-200",
        icon: <AlertTriangle className="w-3 h-3" />,
        accent: "from-red-400/60",
      };
    case "high":
      return {
        bar: "bg-orange-400",
        pill: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <AlertTriangle className="w-3 h-3" />,
        accent: "from-orange-400/60",
      };
    case "moderate":
      return {
        bar: "bg-yellow-400",
        pill: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <CloudRain className="w-3 h-3" />,
        accent: "from-yellow-400/60",
      };
    default:
      return {
        bar: "bg-emerald-400",
        pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <Sun className="w-3 h-3" />,
        accent: "from-emerald-400/60",
      };
  }
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function WeatherSkeleton() {
  return (
    <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 animate-pulse">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400/60 via-blue-300/60 to-transparent rounded-t-[1.75rem]" />
      <div className="h-4 w-28 bg-slate-200/70 rounded mb-4" />
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200/70" />
        <div className="flex flex-col gap-2">
          <div className="h-8 w-16 bg-slate-200/70 rounded" />
          <div className="h-3 w-24 bg-slate-200/70 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-200/70 rounded-xl" />
        ))}
      </div>
      <div className="h-10 bg-slate-200/70 rounded-xl" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function WeatherWidgetComponent() {
  const { weather, isLoading, error, refetch } = useWeather();
  const { addAlert } = useTelemetry();

  useEffect(() => {
    if (weather && (weather.floodRiskContext === "high" || weather.floodRiskContext === "critical")) {
      addAlert({
        type: "WEATHER_WARNING",
        severity: weather.floodRiskContext === "critical" ? "critical" : "warning",
        message: `Weather Alert: ${weather.floodRiskMessage}`,
      });
    }
  }, [weather, addAlert]);

  if (isLoading) return <WeatherSkeleton />;

  if (error || !weather) {
    return (
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
        <CloudRain className="w-8 h-8 text-slate-300" />
        <p className="text-sm text-slate-500 font-medium text-center">Weather data unavailable</p>
        <button
          onClick={refetch}
          className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-semibold transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  const { current, forecast, floodRiskContext, floodRiskMessage, location } = weather;
  const risk = getRiskConfig(floodRiskContext);

  return (
    <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden">
      {/* Top accent bar (color changes with flood risk) */}
      <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent rounded-t-[1.75rem]", risk.accent)} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[#78716c] font-medium text-sm">Weather · Guwahati</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <MapPin className="w-3 h-3" />
          <span>26.14°N, 91.74°E</span>
        </div>
      </div>

      {/* Current Condition */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
          <ConditionIcon group={current.conditionGroup} className="w-7 h-7 text-blue-500" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900 leading-none">
            {current.temperature.toFixed(1)}
            <span className="text-lg font-normal text-slate-500 ml-0.5">°C</span>
          </p>
          <p className="text-sm text-slate-500 mt-0.5">{current.condition}</p>
          <p className="text-xs text-slate-400">Feels like {current.feelsLike.toFixed(0)}°C</p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1 bg-white/60 border border-white/80 rounded-xl py-2.5 px-2 shadow-sm">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-slate-800">{current.humidity}%</span>
          <span className="text-[10px] text-slate-400 leading-tight text-center">Humidity</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-white/60 border border-white/80 rounded-xl py-2.5 px-2 shadow-sm">
          <Wind className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-800">{current.windSpeed.toFixed(0)}</span>
          <span className="text-[10px] text-slate-400 leading-tight text-center">km/h Wind</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-white/60 border border-white/80 rounded-xl py-2.5 px-2 shadow-sm">
          <CloudRain className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-bold text-slate-800">{forecast.next3hPrecipProb}%</span>
          <span className="text-[10px] text-slate-400 leading-tight text-center">Rain (3h)</span>
        </div>
      </div>

      {/* Precipitation forecast bar */}
      <div className="bg-white/50 border border-white/70 rounded-xl px-3.5 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-600">Today&apos;s Precipitation</span>
          <span className="text-xs font-bold text-blue-600">{forecast.todayPrecipSum.toFixed(1)} mm</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200/60">
          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (forecast.todayPrecipSum / 80) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-400">0 mm</span>
          <span className="text-[10px] text-slate-400">80+ mm (Extreme)</span>
        </div>
      </div>

      {/* Flood Risk Context pill */}
      <div className={cn(
        "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold",
        risk.pill,
      )}>
        {risk.icon}
        <span>{floodRiskMessage}</span>
      </div>
    </div>
  );
}

export const WeatherWidget = memo(WeatherWidgetComponent);
