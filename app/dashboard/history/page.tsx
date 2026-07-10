"use client";

import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { cn } from "@/lib/utils";
import {
  Thermometer, Droplets, Wind, Mountain, Ruler,
  TrendingUp, TrendingDown, FileText, FileSpreadsheet, Download
} from "lucide-react";
import { useCallback, useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function StatCard({
  label, value, unit, bg, text, subText, icon: Icon, highlight
}: {
  label: string; value: number; unit: string; bg: string; text: string; subText: string;
  icon: React.ElementType; highlight?: string;
}) {
  return (
    <div className={cn("relative rounded-[1.75rem] p-6 flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden", bg)}>
      {!bg.includes("bg-blue-600") && !bg.includes("bg-gradient") && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
      )}
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

// ── Download helpers ───────────────────────────────────────────────────────────

type HistoryEntry = {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  distance: number;
};

async function downloadCSV(history: HistoryEntry[]) {
  const header = "Time,Temperature (°C),Humidity (%),Pressure (hPa),Altitude (m),Water Level (cm)\n";
  const rows = [...history]
    .reverse()
    .slice(0, 100)
    .map((e) =>
      [
        new Date(e.timestamp).toLocaleString(),
        e.temperature.toFixed(1),
        e.humidity.toFixed(0),
        e.pressure.toFixed(1),
        e.altitude.toFixed(0),
        e.distance.toFixed(0),
      ].join(",")
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `floodeye_logs_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function downloadPDF(history: HistoryEntry[]) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("FloodEye - Sensor Logs", 14, 22);
  
  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on ${new Date().toLocaleString()} · Last ${Math.min(history.length, 100)} readings`, 14, 30);
  
  // Table Data
  const tableData = [...history]
    .reverse()
    .slice(0, 100)
    .map((e) => [
      new Date(e.timestamp).toLocaleString(),
      e.temperature.toFixed(1),
      e.humidity.toFixed(0),
      e.pressure.toFixed(1),
      e.altitude.toFixed(0),
      e.distance.toFixed(0)
    ]);

  autoTable(doc, {
    startY: 38,
    head: [['Time', 'Temp (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Altitude (m)', 'Water Level (cm)']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Exported from FloodEye IoT Dashboard · Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`floodeye_logs_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { history } = useTelemetry();
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const { avgTemp, maxTemp, minTemp, avgHum, avgPress, avgAlt, avgDist, maxDist } = useMemo(() => {
    if (history.length === 0) {
      return { avgTemp: 0, maxTemp: 0, minTemp: 0, avgHum: 0, avgPress: 0, avgAlt: 0, avgDist: 0, maxDist: 0 };
    }
    let sumTemp = 0, sumHum = 0, sumPress = 0, sumAlt = 0, sumDist = 0;
    let mxTemp = -Infinity, mnTemp = Infinity, mxDist = -Infinity;
    
    for (let i = 0; i < history.length; i++) {
      const h = history[i];
      sumTemp += h.temperature;
      sumHum += h.humidity;
      sumPress += h.pressure;
      sumAlt += h.altitude;
      sumDist += h.distance;
      if (h.temperature > mxTemp) mxTemp = h.temperature;
      if (h.temperature < mnTemp) mnTemp = h.temperature;
      if (h.distance > mxDist) mxDist = h.distance;
    }
    
    const len = history.length;
    return {
      avgTemp: sumTemp / len,
      maxTemp: mxTemp,
      minTemp: mnTemp,
      avgHum: sumHum / len,
      avgPress: sumPress / len,
      avgAlt: sumAlt / len,
      avgDist: sumDist / len,
      maxDist: mxDist
    };
  }, [history]);

  const handleCSV = useCallback(async () => {
    try {
      setIsExportingCSV(true);
      await downloadCSV(history);
    } finally {
      // Add a tiny delay so the loading state is visible
      setTimeout(() => setIsExportingCSV(false), 500);
    }
  }, [history]);

  const handlePDF = useCallback(async () => {
    try {
      setIsExportingPDF(true);
      await downloadPDF(history);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 500);
    }
  }, [history]);

  const baseLightBg = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40";
  const baseDarkBg  = "bg-gradient-to-br from-blue-600 to-blue-700 backdrop-blur-xl text-white border border-blue-500/50 shadow-lg shadow-blue-500/30";

  const stats = [
    { label: "Avg Temperature",  value: avgTemp, unit: "°C",  icon: Thermometer, bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-blue-50 text-blue-600" },
    { label: "Max Temperature",  value: maxTemp, unit: "°C",  icon: TrendingUp,  bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-orange-100 text-orange-600" },
    { label: "Min Temperature",  value: minTemp, unit: "°C",  icon: TrendingDown,bg: baseDarkBg,  text: "text-white",   subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Avg Humidity",     value: avgHum,    unit: "%",   icon: Droplets,    bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-blue-100 text-blue-600" },
    { label: "Avg Pressure",     value: avgPress,    unit: "hPa", icon: Wind,        bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-green-100 text-green-600" },
    { label: "Avg Altitude",     value: avgAlt,    unit: "m",   icon: Mountain,    bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-purple-100 text-purple-600" },
    { label: "Avg Water Level",  value: avgDist,    unit: "cm",  icon: Ruler,       bg: baseDarkBg,  text: "text-white",   subText: "text-white/70",  highlight: "bg-white/20 text-white" },
    { label: "Max Water Level",  value: maxDist,    unit: "cm",  icon: Ruler,       bg: baseLightBg, text: "text-slate-900", subText: "text-slate-500", highlight: "bg-amber-100 text-amber-600" },
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
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 overflow-hidden transition-all duration-200 hover:shadow-xl">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />

        {/* Table header with download buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-slate-900 font-bold text-base">Recent Sensor Logs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing last {Math.min(history.length, 20)} of {history.length} readings</p>
          </div>
          <div className="flex items-center gap-3">
            {/* CSV Download */}
            <button
              onClick={handleCSV}
              disabled={history.length === 0 || isExportingCSV}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-white/60 border border-emerald-200/80 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isExportingCSV ? (
                <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin shrink-0" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
              )}
              <span className="relative z-10">{isExportingCSV ? "Exporting..." : "Export CSV"}</span>
            </button>
            
            {/* PDF Download */}
            <button
              onClick={handlePDF}
              disabled={history.length === 0 || isExportingPDF}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-blue-700 bg-white/60 border border-blue-200/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isExportingPDF ? (
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin shrink-0" />
              ) : (
                <FileText className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
              )}
              <span className="relative z-10">{isExportingPDF ? "Exporting..." : "Export PDF"}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/30 backdrop-blur-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5 font-bold">Time</th>
                <th className="px-5 py-3.5 font-bold">Temp (°C)</th>
                <th className="px-5 py-3.5 font-bold">Humidity (%)</th>
                <th className="px-5 py-3.5 font-bold">Pressure (hPa)</th>
                <th className="px-5 py-3.5 font-bold">Altitude (m)</th>
                <th className="px-5 py-3.5 font-bold">Water Level (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...history].reverse().slice(0, 20).map((entry, idx) => (
                <tr key={idx} className="hover:bg-white/60 transition-colors">
                  <td className="px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-rose-600">{entry.temperature.toFixed(1)}</td>
                  <td className="px-5 py-3.5 font-semibold text-blue-600">{entry.humidity.toFixed(0)}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{entry.pressure.toFixed(1)}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{entry.altitude.toFixed(0)}</td>
                  <td className="px-5 py-3.5 font-semibold text-amber-600">{entry.distance.toFixed(0)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Download className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-medium">No history data available</p>
                      <p className="text-xs opacity-70">Start the simulation or connect hardware to collect readings.</p>
                    </div>
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
