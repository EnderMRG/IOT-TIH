"use client";

import { Bell, Zap, ZapOff, WifiOff, LogOut, Activity, AlertTriangle, Info, ShieldCheck, X, Trash2, ArrowRight } from "lucide-react";
import { useTelemetry, Alert } from "@/components/providers/TelemetryProvider";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";

// ── Severity config ───────────────────────────────────────────────────────────

function getSeverityConfig(severity: Alert["severity"]) {
  switch (severity) {
    case "critical":
      return {
        dot: "bg-red-500",
        badge: "bg-red-100 text-red-700 border-red-200",
        row: "bg-red-50/70 hover:bg-red-50",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />,
        label: "Critical",
      };
    case "warning":
      return {
        dot: "bg-orange-400",
        badge: "bg-orange-100 text-orange-700 border-orange-200",
        row: "bg-orange-50/60 hover:bg-orange-50",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />,
        label: "Warning",
      };
    default:
      return {
        dot: "bg-blue-400",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        row: "bg-blue-50/40 hover:bg-blue-50",
        icon: <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />,
        label: "Info",
      };
  }
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── NotificationRow ───────────────────────────────────────────────────────────

function NotificationRow({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  const cfg = getSeverityConfig(alert.severity);
  return (
    <div className={cn(
      "px-4 py-3 flex items-start gap-3 transition-colors group relative",
      cfg.row,
      !alert.read && "border-l-2 border-blue-400"
    )}>
      {cfg.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border", cfg.badge)}>
            {cfg.label}
          </span>
          {!alert.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{alert.message}</p>
        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(alert.updatedAt ?? alert.timestamp)}</p>
      </div>
      <button
        onClick={onDismiss}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-all shrink-0"
        title="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export function Navbar() {
  const {
    isSimulating, setIsSimulating,
    alerts, unreadCount, deviceStatus, userRole, userName,
    dismissAlert, clearAlerts, markAllRead,
  } = useTelemetry();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [showSimTooltip, setShowSimTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all read when panel opens
  const handleBellClick = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) markAllRead();
  };

  const isConnected = deviceStatus?.esp32Online ?? false;

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-4 md:mx-6 mt-4 mb-2 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 px-5 py-3 flex items-center justify-between gap-4">

        {/* Left: Greeting */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate">
            <EncryptedText
              text={`Hello, ${userName || userRole || "Operator"}!`}
              encryptedClassName="text-slate-400"
              revealedClassName="text-slate-900"
              revealDelayMs={120}
            />
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-slate-400 text-xs">{date} · {time}</p>

            {/* Connection pill */}
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              isConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-zinc-100 text-zinc-500 border-zinc-200"
            )}>
              {isConnected
                ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</>
                : <><WifiOff className="w-2.5 h-2.5" />Offline</>
              }
            </span>

            {/* Role pill */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-widest">
              {userRole}
            </span>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Simulation Toggle — Admin only */}
          {userRole === "admin" && (
            <div className="relative">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                onMouseEnter={() => setShowSimTooltip(true)}
                onMouseLeave={() => setShowSimTooltip(false)}
                className={cn(
                  "group flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 relative",
                  isSimulating
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30"
                    : "bg-white/50 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-white/80"
                )}
              >
                {isSimulating ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                {isSimulating && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-ping" />}
                {isSimulating && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full" />}
              </button>
              {showSimTooltip && (
                <div className="absolute top-11 right-0 bg-slate-900 text-white text-[10px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl z-50">
                  {isSimulating ? "Simulation ON — click to stop" : "Simulation OFF — click to start"}
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              )}
            </div>
          )}

          {/* Bell / Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleBellClick}
              className={cn(
                "group flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 relative",
                showNotifications
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "bg-white/50 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-white/80"
              )}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-[22rem] bg-white/75 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-300/40 border border-white/70 z-50 overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between bg-white/40">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                    {alerts.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {alerts.length}
                      </span>
                    )}
                  </div>
                  {alerts.length > 0 && (
                    <button
                      onClick={() => clearAlerts()}
                      className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>

                {/* Alert list */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/60">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600">All Clear</p>
                        <p className="text-xs text-slate-400 mt-0.5">All sensors reading within normal range.</p>
                      </div>
                    </div>
                  ) : (
                    alerts.slice(0, 10).map((alert) => (
                      <NotificationRow
                        key={alert.id}
                        alert={alert}
                        onDismiss={() => dismissAlert(alert.id)}
                      />
                    ))
                  )}
                </div>

                {/* Footer */}
                {alerts.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-100/80 bg-white/40">
                    <Link
                      href="/dashboard/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View all alerts
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200" />

          {/* Log Out */}
          <button
            onClick={async () => {
              localStorage.removeItem("floodeye_session");
              localStorage.removeItem("floodeye_user_name");
              await logout();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white/50 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
