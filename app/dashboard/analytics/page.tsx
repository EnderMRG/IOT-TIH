"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, Mountain, Ruler } from "lucide-react";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { TimeFilter } from "@/components/common/TimeFilter";
import type { TelemetryData } from "@/components/providers/TelemetryProvider";

const charts = [
  { key: "temperature", label: "Temperature",          unit: "°C",  color: "#e07a5f", icon: Thermometer, variant: "bg-white" },
  { key: "humidity",    label: "Humidity",             unit: "%",   color: "#3b82f6", icon: Droplets,    variant: "bg-white" },
  { key: "pressure",    label: "Atmospheric Pressure", unit: "hPa", color: "#355441", icon: Wind,        variant: "bg-[#fcf7f1]" },
  { key: "altitude",    label: "Altitude",             unit: "m",   color: "#8b5cf6", icon: Mountain,    variant: "bg-white" },
  { key: "distance",    label: "Water Level",          unit: "cm",  color: "#f59e0b", icon: Ruler,       variant: "bg-[#5f7564]" },
] as const;

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("1h");
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/history?range=${timeFilter}`)
      .then((r) => r.json())
      .then((data: TelemetryData[]) => { if (!cancelled) setHistory(data); })
      .catch((err) => console.error("[AnalyticsPage] history fetch failed:", err))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [timeFilter]);

  const chartData = history.map((e) => ({
    time:        new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temperature: e.temperature,
    humidity:    e.humidity,
    pressure:    e.pressure,
    altitude:    e.altitude,
    distance:    e.distance,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1a]">Historical Analytics</h2>
          <p className="text-[#78716c] text-sm mt-1">
            Explore trends and patterns across all sensors — {history.length} readings loaded.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <span className="text-xs text-zinc-400 animate-pulse">Loading…</span>}
          <TimeFilter value={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts.map((chart) => {
          const isDark = chart.variant === "bg-[#5f7564]";
          const Icon = chart.icon;
          return (
            <div
              key={chart.key}
              className={`${chart.variant} rounded-[2rem] p-6 shadow-sm min-h-[320px] flex flex-col transition-shadow hover:shadow-md ${chart.key === "pressure" ? "lg:col-span-2" : ""}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-full ${isDark ? "bg-white/20 text-white" : "bg-[#e1eae2] text-[#355441]"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#1c1c1a]"}`}>{chart.label}</h3>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-[#78716c]"}`}>Measured in {chart.unit}</p>
                </div>
              </div>
              <div className="flex-1">
                {loading ? (
                  <div className={`h-full flex items-center justify-center text-sm ${isDark ? "text-white/40" : "text-zinc-300"}`}>
                    Loading data…
                  </div>
                ) : chartData.length === 0 ? (
                  <div className={`h-full flex items-center justify-center text-sm ${isDark ? "text-white/40" : "text-zinc-300"}`}>
                    No data available for this range.
                  </div>
                ) : (
                  <CustomLineChart
                    data={chartData}
                    dataKey={chart.key}
                    color={isDark ? "#ffffff" : chart.color}
                    label={`${chart.label} (${chart.unit})`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
