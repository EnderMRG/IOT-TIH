"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelemetry } from "@/components/providers/TelemetryProvider";

const navItems = [
  { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
  { icon: BarChart3, href: "/dashboard/analytics", label: "Analytics" },
  { icon: History, href: "/dashboard/history", label: "History" },
  { icon: Bell, href: "/dashboard/alerts", label: "Alerts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userRole } = useTelemetry();

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 md:relative md:w-24 shrink-0 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-8 bg-white/40 backdrop-blur-xl md:rounded-[2.5rem] rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t border-white/60 md:border md:border-white/60 h-20 md:h-[calc(100vh-3rem)] md:overflow-y-auto md:my-6 md:ml-6 md:sticky md:top-6 no-scrollbar">

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-row md:flex-col items-center justify-center md:justify-start gap-2 sm:gap-6 w-full md:w-auto px-4 md:px-0">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
            
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-zinc-400 hover:text-blue-600 hover:bg-blue-600/5 hover:scale-105 active:scale-95"
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              
              <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          );
        })}

        {/* Admin Only: Device Details */}
        {userRole === "admin" && (
          <Link
            href="/dashboard/devices"
            className={cn(
              "shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
              pathname === "/dashboard/devices" || pathname.startsWith("/dashboard/devices/")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "text-zinc-400 hover:text-blue-600 hover:bg-blue-600/5 hover:scale-105 active:scale-95"
            )}
            title="Device Details"
          >
            <Server className="w-5 h-5" strokeWidth={pathname.includes("/dashboard/devices") ? 2.5 : 2} />
            
            <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Device Details
            </div>
          </Link>
        )}
      </nav>

      {/* Bottom Actions - Admin Only */}
      {userRole === "admin" && (
        <div className="flex flex-row md:flex-col items-center gap-2 sm:gap-6 md:mt-auto md:pt-6 shrink-0 border-l md:border-l-0 md:border-t border-slate-100 pl-4 md:pl-0 md:pt-6">
        <Link
          href="/dashboard/settings"
          className={cn(
            "shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group relative",
            pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "text-zinc-400 hover:text-blue-600 hover:bg-blue-600/5 hover:scale-105 active:scale-95"
          )}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          </Link>
        </div>
      )}
    </aside>
  );
}
