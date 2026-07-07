"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Fan
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
  { icon: BarChart3, href: "/dashboard/analytics", label: "Analytics" },
  { icon: History, href: "/dashboard/history", label: "Statistics" },
  { icon: Bell, href: "/dashboard/alerts", label: "Alerts" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 flex items-center justify-around px-2 py-3 shadow-[0_-4px_20px_rgb(0,0,0,0.04)]">
        {[...navItems, { icon: Settings, href: "/dashboard/settings", label: "Settings" }].map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-[#355441] text-white shadow-lg shadow-[#355441]/25"
                  : "text-zinc-400 hover:text-[#355441] active:scale-95"
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-24 shrink-0 flex-col items-center py-8 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[calc(100vh-3rem)] overflow-y-auto my-6 ml-6 sticky top-6 no-scrollbar z-40">
        {/* Brand Icon */}
        <div className="mb-12 shrink-0">
          <div className="w-12 h-12 flex items-center justify-center text-[#355441]">
            <Fan className="w-8 h-8 animate-spin-slow" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-6">
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
                    ? "bg-[#355441] text-white shadow-lg shadow-[#355441]/25"
                    : "text-zinc-400 hover:text-[#355441] hover:bg-[#355441]/5 hover:scale-105 active:scale-95"
                )}
                title={item.label}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />

                {/* Tooltip */}
                <div className="absolute left-16 px-3 py-1.5 bg-[#1c1c1a] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-6 mt-auto pt-6 shrink-0">
          <Link
            href="/dashboard/settings"
            className={cn(
              "shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group relative",
              pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
                ? "bg-[#355441] text-white shadow-lg shadow-[#355441]/25"
                : "text-zinc-400 hover:text-[#355441] hover:bg-[#355441]/5 hover:scale-105 active:scale-95"
            )}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
