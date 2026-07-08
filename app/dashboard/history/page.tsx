"use client";

import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, Wind, Mountain, Ruler, TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  label, value, unit, bg, text, subText, icon: Icon, highlight
}: {
  label: string; value: number; unit: string; bg: string; text: string; subText: string;
  icon: React.ElementType; highlight?: string;
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

export default function HistoryPage() {
  const { history } = useTelemetry();

  const safe = (arr: number[]) => (arr.length ? arr : [0]);

  const avg = (key: keyof typeof history[0]) =>
    (history.reduce((a, b) => a + (b[key] as number), 0) / (history.length || 1));
  const max = (key: keyof typeof history[0]) =>
    Math.max(...history.map((h) => h[key] as number), 0);
  const min = (key: keyof typeof history[0]) =>
    Math.min(...history.map((h) => h[key] as number), 9999);

  const stats = [
    { label: "Avg Temperature",  value: avg("temperature"),  unit: "°C",  icon: Thermometer, bg: "bg-white",       text: "text-slate-900", subText: "text-slate-500", highlight: "bg-blue-50 text-blue-600" },
    { label: "Max Temperature",  value: max("temperature"),  unit: "°C",  icon: TrendingUp,  bg: "bg-white border border-slate-100",   text: "text-slate-900", subText: "text-slate-500", highlight: "bg-orange-100 text-orange-600" },
    { label: "Min Temperature",  value: min("temperature"),  unit: "°C",  icon: TrendingDown,bg: "bg-blue-600",   text: "text-white",      subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Avg Humidity",     value: avg("humidity"),     unit: "%",   icon: Droplets,    bg: "bg-white",       text: "text-slate-900", subText: "text-slate-500", highlight: "bg-blue-100 text-blue-600" },
    { label: "Avg Pressure",     value: avg("pressure"),     unit: "hPa", icon: Wind,        bg: "bg-white border border-slate-100",   text: "text-slate-900", subText: "text-slate-500", highlight: "bg-green-100 text-green-600" },
    { label: "Avg Altitude",     value: avg("altitude"),     unit: "m",   icon: Mountain,    bg: "bg-white",       text: "text-slate-900", subText: "text-slate-500", highlight: "bg-purple-100 text-purple-600" },
    { label: "Avg Water Level",     value: avg("distance"),     unit: "cm",  icon: Ruler,       bg: "bg-blue-600",   text: "text-white",      subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Max Water Level",     value: min("distance"),     unit: "cm",  icon: Ruler,       bg: "bg-white border border-slate-100",   text: "text-slate-900", subText: "text-slate-500", highlight: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Statistics</h2>
        <p className="text-slate-500 text-sm mt-1">Calculated metrics from your sensor history.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Historical Log Table */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm">
        <h3 className="text-slate-900 font-bold mb-4">Recent Sensor Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-slate-50 border-b border-zinc-100">
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
                  <td className="px-5 py-3 text-zinc-500 font-medium">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#e07a5f]">{entry.temperature.toFixed(1)}</td>
                  <td className="px-5 py-3 font-semibold text-blue-600">{entry.humidity.toFixed(0)}</td>
                  <td className="px-5 py-3 text-slate-900">{entry.pressure.toFixed(1)}</td>
                  <td className="px-5 py-3 text-slate-900">{entry.altitude.toFixed(0)}</td>
                  <td className="px-5 py-3 font-semibold text-amber-600">{entry.distance.toFixed(0)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-400 text-sm">No data yet. Start the simulation to collect readings.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
