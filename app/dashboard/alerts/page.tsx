"use client";

import { useTelemetry, Alert } from "@/components/providers/TelemetryProvider";
import { AlertTriangle, Info, ShieldAlert, Thermometer, Droplets, Wind, Ruler, WifiOff, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

const alertTypeConfig = {
  HIGH_TEMPERATURE:      { label: "High Temperature",      icon: Thermometer },
  HIGH_HUMIDITY:         { label: "High Humidity",         icon: Droplets },
  RAPID_PRESSURE_CHANGE: { label: "Rapid Pressure Change", icon: Wind },
  OBJECT_TOO_CLOSE:      { label: "Object Too Close",      icon: Ruler },
  SENSOR_OFFLINE:        { label: "Sensor Offline",        icon: WifiOff },
} as const;

function AlertCard({ alert }: { alert: Alert }) {
  const cfg = alertTypeConfig[alert.type];
  const Icon = cfg.icon;

  const bgClass =
    alert.severity === "critical" ? "bg-red-50 border-red-200" :
    alert.severity === "warning"  ? "bg-orange-50 border-orange-200" :
                                    "bg-blue-50 border-blue-200";

  const textClass =
    alert.severity === "critical" ? "text-red-800" :
    alert.severity === "warning"  ? "text-orange-800" :
                                    "text-blue-800";

  const iconEl =
    alert.severity === "critical" ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
    alert.severity === "warning"  ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                                    <Info className="w-5 h-5 text-blue-500" />;

  return (
    <div className={cn("p-5 rounded-2xl border flex items-start gap-4", bgClass)}>
      <div className="shrink-0 mt-0.5">{iconEl}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-4 h-4 shrink-0", textClass)} />
            <p className={cn("text-sm font-bold", textClass)}>{cfg.label}</p>
            <span className={cn("text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-white/60", textClass)}>
              {alert.severity}
            </span>
          </div>
          <time className="text-xs font-medium text-zinc-500 shrink-0">
            {new Date(alert.timestamp).toLocaleString()}
          </time>
        </div>
        <p className="text-sm mt-2 text-zinc-700">{alert.message}</p>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const { alerts, clearAlerts } = useTelemetry();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1a]">Active Alerts</h2>
          <p className="text-[#78716c] text-sm mt-1">Real-time notifications from your IoT sensors.</p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors shadow-sm self-start md:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm min-h-[500px]">
        {alerts.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="All Systems Normal"
            description="No active alerts. Device and sensor readings are within safe thresholds."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
