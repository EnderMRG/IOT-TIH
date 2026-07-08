"use client";

import { useState } from "react";
import { Thermometer, Droplets, Wind, Mountain, Ruler } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { TimeFilter } from "@/components/common/TimeFilter";

const charts = [
  { key: "temperature", label: "Temperature",          unit: "°C",  color: "#e07a5f", icon: Thermometer, variant: "bg-white" },
  { key: "humidity",    label: "Humidity",             unit: "%",   color: "#3b82f6", icon: Droplets,    variant: "bg-white" },
  { key: "pressure",    label: "Atmospheric Pressure", unit: "hPa", color: "#2563eb", icon: Wind,        variant: "bg-white border border-slate-100" },
  { key: "altitude",    label: "Altitude",             unit: "m",   color: "#8b5cf6", icon: Mountain,    variant: "bg-white" },
  { key: "distance",    label: "Water Level",             unit: "cm",  color: "#f59e0b", icon: Ruler,       variant: "bg-blue-600" },
] as const;

export default function AnalyticsPage() {
  const { history } = useTelemetry();
  const [timeFilter, setTimeFilter] = useState("1h");

  const chartData = history.map((e) => ({
    time: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temperature: e.temperature,
    humidity: e.humidity,
    pressure: e.pressure,
    altitude: e.altitude,
    distance: e.distance,
  }));

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
          const isDark = chart.variant === "bg-blue-600";
          const Icon = chart.icon;
          return (
            <div
              key={chart.key}
              className={`${chart.variant} rounded-[2rem] p-6 shadow-sm min-h-[320px] flex flex-col transition-shadow hover:shadow-md ${chart.key === "pressure" ? "lg:col-span-2" : ""}`}
            >
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
