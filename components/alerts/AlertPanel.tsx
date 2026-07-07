"use client";

import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { cn } from "@/lib/utils";

export function AlertPanel() {
  const { alerts } = useTelemetry();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-[#1c1c1a] font-bold text-base mb-4">Active Alerts</h3>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-[#355441]" />
          </div>
          <p className="text-sm font-medium text-center">All sensors normal</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-xl flex items-start gap-2.5",
                alert.severity === "critical" && "bg-red-50",
                alert.severity === "warning"  && "bg-orange-50",
                alert.severity === "info"     && "bg-blue-50"
              )}
            >
              <div className="mt-0.5 shrink-0">
                {alert.severity === "critical" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {alert.severity === "warning"  && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                {alert.severity === "info"     && <Info className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-bold truncate",
                  alert.severity === "critical" && "text-red-700",
                  alert.severity === "warning"  && "text-orange-700",
                  alert.severity === "info"     && "text-blue-700"
                )}>
                  {alert.severity.toUpperCase()}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{alert.message}</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {alerts.length > 5 && (
            <p className="text-xs text-center text-zinc-400 pt-1">+{alerts.length - 5} more alerts</p>
          )}
        </div>
      )}
    </div>
  );
}
