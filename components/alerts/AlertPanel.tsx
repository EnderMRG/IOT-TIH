"use client";

import { AlertTriangle, Info, ShieldCheck, X } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AlertPanel() {
  const { alerts, dismissAlert } = useTelemetry();

  const visibleAlerts = alerts.slice(0, 5);

  return (
    <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1c1c1a] font-bold text-base">Active Alerts</h3>
        {alerts.length > 0 && (
          <Link
            href="/dashboard/alerts"
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all ({alerts.length})
          </Link>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3 py-6">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm font-medium text-center text-slate-500">All sensors normal</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {visibleAlerts.map((alert) => {
            const isCritical = alert.severity === "critical";
            const isWarning  = alert.severity === "warning";

            return (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-xl flex items-start gap-2.5 group transition-colors relative",
                  isCritical && "bg-red-50/80 border border-red-100",
                  isWarning  && "bg-orange-50/80 border border-orange-100",
                  !isCritical && !isWarning && "bg-blue-50/80 border border-blue-100",
                  !alert.read && "border-l-4 border-l-blue-400"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {isCritical && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {isWarning  && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                  {!isCritical && !isWarning && <Info className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    isCritical && "text-red-700",
                    isWarning  && "text-orange-700",
                    !isCritical && !isWarning && "text-blue-700"
                  )}>
                    {alert.severity}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{alert.message}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">{timeAgo(alert.updatedAt ?? alert.timestamp)}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          {alerts.length > 5 && (
            <Link
              href="/dashboard/alerts"
              className="block text-xs text-center text-blue-600 hover:text-blue-700 font-semibold pt-1 transition-colors"
            >
              +{alerts.length - 5} more alerts — view all
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
