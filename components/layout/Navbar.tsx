"use client";

import { Bell, Wifi, WifiOff } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { alerts, deviceStatus, isOffline } = useTelemetry();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
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

  const isConnected = !isOffline && (deviceStatus?.esp32Online ?? false);

  return (
    <header className="flex items-center justify-between w-full md:h-24 pt-4 pb-2 px-4 md:pt-6 md:pb-2 md:px-8">
      {/* Left: Greeting + Date */}
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1c1c1a]">Hello, Operator!</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-[#78716c] text-sm">{date} · {time}</p>
          <span className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            isConnected ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"
          )}>
            {isConnected
              ? <><Wifi className="w-3 h-3" /> Connected</>
              : <><WifiOff className="w-3 h-3" /> Offline</>
            }
          </span>
        </div>
      </div>

      {/* Right: Bell / Notifications */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full shadow-sm transition-all duration-300 relative",
              showNotifications ? "bg-[#355441] text-white" : "bg-white text-zinc-400 hover:text-[#355441]"
            )}
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {alerts.length > 9 ? "9+" : alerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-16 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-[1.5rem] shadow-xl border border-zinc-100 z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <p className="font-bold text-[#1c1c1a] text-sm">Notifications</p>
                {alerts.length > 0 && (
                  <span className="text-xs text-zinc-400">{alerts.length} new</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-zinc-400 gap-2">
                    <Bell className="w-8 h-8 opacity-30" />
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs opacity-70">Device alerts will appear here.</p>
                  </div>
                ) : (
                  alerts.slice(0, 8).map((alert) => (
                    <div key={alert.id} className={cn(
                      "px-5 py-3 border-b border-zinc-50 last:border-0 flex items-start gap-3",
                      alert.severity === "critical" && "bg-red-50",
                      alert.severity === "warning"  && "bg-orange-50",
                      alert.severity === "info"     && "bg-blue-50",
                    )}>
                      <div className="flex-1">
                        <p className={cn(
                          "text-xs font-bold",
                          alert.severity === "critical" && "text-red-600",
                          alert.severity === "warning"  && "text-orange-600",
                          alert.severity === "info"     && "text-blue-600",
                        )}>
                          {alert.severity.toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{alert.message}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 shrink-0 mt-0.5">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
