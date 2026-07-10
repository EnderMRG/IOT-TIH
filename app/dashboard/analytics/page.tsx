"use client";

import { useState, useMemo } from "react";
import { Thermometer, Droplets, Wind, Mountain, Ruler } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { TimeFilter } from "@/components/common/TimeFilter";

const charts = [
  { key: "temperature", label: "Temperature",          unit: "°C",  color: "#e07a5f", icon: Thermometer, variant: "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40" },
  { key: "humidity",    label: "Humidity",             unit: "%",   color: "#3b82f6", icon: Droplets,    variant: "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40" },
  { key: "pressure",    label: "Atmospheric Pressure", unit: "hPa", color: "#2563eb", icon: Wind,        variant: "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40" },
  { key: "altitude",    label: "Altitude",             unit: "m",   color: "#8b5cf6", icon: Mountain,    variant: "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40" },
  { key: "distance",    label: "Water Level",             unit: "cm",  color: "#f59e0b", icon: Ruler,       variant: "bg-gradient-to-br from-blue-600 to-blue-700 backdrop-blur-xl text-white border border-blue-500/50 shadow-lg shadow-blue-500/30" },
] as const;

export default function AnalyticsPage() {
  const { history } = useTelemetry();
  const [timeFilter, setTimeFilter] = useState("1h");

  const chartData = useMemo(() => {
    return history.map((e) => ({
      time: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temperature: e.temperature,
      humidity: e.humidity,
      pressure: e.pressure,
      altitude: e.altitude,
      distance: e.distance,
    }));
  }, [history]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historical Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Explore trends and patterns across all sensors.</p>
        </div>
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
      </div>

      {/* Charts Grid — 2 col up top, full width pressure, remaining 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts.map((chart) => {
          const isDark = chart.variant.includes("bg-gradient");
          const Icon = chart.icon;
          return (
            <div
              key={chart.key}
              className={`relative ${chart.variant} rounded-[1.75rem] p-6 min-h-[320px] flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${chart.key === "pressure" ? "lg:col-span-2" : ""}`}
            >
              {/* Accent top gradient on light cards */}
              {!isDark && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-full ${isDark ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{chart.label}</h3>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>Measured in {chart.unit}</p>
                </div>
              </div>
              <div className="flex-1">
                <CustomLineChart
                  data={chartData}
                  dataKey={chart.key}
                  color={isDark ? "#ffffff" : chart.color}
                  label={`${chart.label} (${chart.unit})`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
