"use client";

import { useState, useEffect } from "react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, Wind, Mountain, Ruler, TrendingUp, TrendingDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FieldStats {
  avg: number;
  min: number;
  max: number;
  trend: "up" | "down" | "stable";
}

interface AnalyticsResponse {
  count: number;
  analytics: {
    temperature: FieldStats;
    humidity:    FieldStats;
    pressure:    FieldStats;
    altitude:    FieldStats;
    distance:    FieldStats;
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label, value, unit, bg, text, subText, icon: Icon, highlight,
}: {
  label: string; value: number; unit: string; bg: string; text: string;
  subText: string; icon: React.ElementType; highlight?: string;
}) {
  return (
    <div className={cn("rounded-[2rem] p-6 shadow-sm flex flex-col justify-between gap-3", bg)}>
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-semibold uppercase tracking-wide", subText)}>{label}</p>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", highlight ?? "bg-white/20")}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-4xl font-bold tracking-tight", text)}>{value.toFixed(1)}</span>
        <span className={cn("text-sm font-medium", subText)}>{unit}</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { history } = useTelemetry();
  const [analytics, setAnalytics] = useState<AnalyticsResponse["analytics"] | null>(null);

  useEffect(() => {
    fetch("/api/analytics?range=24h")
      .then((r) => r.json())
      .then((body: AnalyticsResponse) => setAnalytics(body.analytics))
      .catch((err) => console.error("[HistoryPage] analytics fetch failed:", err));
  }, []);

  const t  = analytics?.temperature ?? { avg: 0, min: 0, max: 0, trend: "stable" as const };
  const hu = analytics?.humidity    ?? { avg: 0, min: 0, max: 0, trend: "stable" as const };
  const p  = analytics?.pressure    ?? { avg: 0, min: 0, max: 0, trend: "stable" as const };
  const al = analytics?.altitude    ?? { avg: 0, min: 0, max: 0, trend: "stable" as const };
  const d  = analytics?.distance    ?? { avg: 0, min: 0, max: 0, trend: "stable" as const };

  const stats = [
    { label: "Avg Temperature", value: t.avg,  unit: "°C",  icon: Thermometer, bg: "bg-white",     text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-[#e1eae2] text-[#355441]" },
    { label: "Max Temperature", value: t.max,  unit: "°C",  icon: TrendingUp,  bg: "bg-[#fcf7f1]", text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-orange-100 text-orange-600" },
    { label: "Min Temperature", value: t.min,  unit: "°C",  icon: TrendingDown,bg: "bg-[#5f7564]", text: "text-white",      subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Avg Humidity",    value: hu.avg, unit: "%",   icon: Droplets,    bg: "bg-white",     text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-blue-100 text-blue-600" },
    { label: "Avg Pressure",    value: p.avg,  unit: "hPa", icon: Wind,        bg: "bg-[#fcf7f1]", text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-green-100 text-green-600" },
    { label: "Avg Altitude",    value: al.avg, unit: "m",   icon: Mountain,    bg: "bg-white",     text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-purple-100 text-purple-600" },
    { label: "Avg Water Level", value: d.avg,  unit: "cm",  icon: Ruler,       bg: "bg-[#5f7564]", text: "text-white",      subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Min Water Level", value: d.min,  unit: "cm",  icon: Ruler,       bg: "bg-[#fcf7f1]", text: "text-[#1c1c1a]", subText: "text-[#78716c]", highlight: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1c1c1a]">Statistics</h2>
        <p className="text-[#78716c] text-sm mt-1">Calculated from the last 24 hours of ThingSpeak data.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Historical Log Table */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm">
        <h3 className="text-[#1c1c1a] font-bold mb-4">Recent Sensor Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-[#f4f3ed] border-b border-zinc-100">
              <tr>
                <th className="px-5 py-3 rounded-tl-xl">Time</th>
                <th className="px-5 py-3">Temp (°C)</th>
                <th className="px-5 py-3">Humidity (%)</th>
                <th className="px-5 py-3">Pressure (hPa)</th>
                <th className="px-5 py-3">Altitude (m)</th>
                <th className="px-5 py-3 rounded-tr-xl">Water Level (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().slice(0, 20).map((entry, idx) => (
                <tr key={idx} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 font-medium">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                  <td className="px-5 py-3 font-semibold text-[#e07a5f]">{entry.temperature.toFixed(1)}</td>
                  <td className="px-5 py-3 font-semibold text-blue-600">{entry.humidity.toFixed(0)}</td>
                  <td className="px-5 py-3 text-[#1c1c1a]">{entry.pressure.toFixed(1)}</td>
                  <td className="px-5 py-3 text-[#1c1c1a]">{entry.altitude.toFixed(0)}</td>
                  <td className="px-5 py-3 font-semibold text-amber-600">{entry.distance.toFixed(0)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-400 text-sm">
                    Waiting for live data from ThingSpeak…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
