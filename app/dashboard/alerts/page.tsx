"use client";

import { useTelemetry, Alert } from "@/components/providers/TelemetryProvider";
import {
  AlertTriangle, Info, ShieldCheck, Thermometer, Droplets, Wind,
  Ruler, WifiOff, Trash2, X, Clock
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

// ── Config ────────────────────────────────────────────────────────────────────

const alertTypeConfig = {
  HIGH_TEMPERATURE:      { label: "High Temperature",      icon: Thermometer },
  HIGH_HUMIDITY:         { label: "High Humidity",         icon: Droplets },
  RAPID_PRESSURE_CHANGE: { label: "Pressure Drop",         icon: Wind },
  HIGH_WATER_LEVEL:      { label: "High Water Level",      icon: Ruler },
  RAPID_WATER_RISE:      { label: "Rapid Water Rise",      icon: AlertTriangle },
  OBJECT_TOO_CLOSE:      { label: "Object Too Close",      icon: Ruler },
  SENSOR_OFFLINE:        { label: "Sensor Offline",        icon: WifiOff },
} as const;

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

// ── AlertCard ─────────────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  const cfg = alertTypeConfig[alert.type];
  const Icon = cfg.icon;

  const isCritical = alert.severity === "critical";
  const isWarning  = alert.severity === "warning";

  const bgClass =
    isCritical ? "bg-red-50/70 border-red-200/60" :
    isWarning  ? "bg-orange-50/70 border-orange-200/60" :
                 "bg-blue-50/70 border-blue-200/60";

  const textClass =
    isCritical ? "text-red-700" :
    isWarning  ? "text-orange-700" :
                 "text-blue-700";

  const badgeBg =
    isCritical ? "bg-red-100 text-red-700 border-red-200" :
    isWarning  ? "bg-orange-100 text-orange-700 border-orange-200" :
                 "bg-blue-100 text-blue-700 border-blue-200";

  const iconEl =
    isCritical ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
    isWarning  ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                 <Info className="w-5 h-5 text-blue-500" />;

  return (
    <div className={cn(
      "p-5 rounded-2xl border flex items-start gap-4 transition-all duration-200 group relative",
      bgClass,
      !alert.read && "border-l-4 border-l-blue-500"
    )}>
      {/* Unread dot */}
      {!alert.read && (
        <span className="absolute top-3 right-12 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <div className="shrink-0 mt-0.5">{iconEl}</div>

      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon className={cn("w-4 h-4 shrink-0", textClass)} />
            <p className={cn("text-sm font-bold", textClass)}>{cfg.label}</p>
            <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border", badgeBg)}>
              {alert.severity}
            </span>
          </div>
          <time className="text-xs font-medium text-zinc-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(alert.updatedAt ?? alert.timestamp)}
          </time>
        </div>

        <p className="text-sm mt-2 text-zinc-700 leading-relaxed">{alert.message}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="shrink-0 p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
        title="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const { alerts, clearAlerts, dismissAlert } = useTelemetry();

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts  = alerts.filter((a) => a.severity === "warning");
  const infoAlerts     = alerts.filter((a) => a.severity === "info");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Alert Log</h2>
          <p className="text-slate-500 text-sm mt-1">
            {alerts.length === 0
              ? "No active alerts — all sensors are within safe thresholds."
              : `${alerts.length} alert${alerts.length !== 1 ? "s" : ""} · ${criticalAlerts.length} critical · ${warningAlerts.length} warning`}
          </p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Summary badges */}
      {alerts.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {criticalAlerts.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm font-semibold text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalAlerts.length} Critical
            </div>
          )}
          {warningAlerts.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm font-semibold text-orange-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              {warningAlerts.length} Warning
            </div>
          )}
          {infoAlerts.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700">
              <Info className="w-3.5 h-3.5" />
              {infoAlerts.length} Info
            </div>
          )}
        </div>
      )}

      {/* Alert list */}
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 min-h-[400px] transition-all duration-200 hover:shadow-xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />

        {alerts.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="All Systems Normal"
            description="No active alerts. Device and sensor readings are within safe thresholds."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {/* Critical first */}
            {criticalAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
            ))}
            {warningAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
            ))}
            {infoAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
