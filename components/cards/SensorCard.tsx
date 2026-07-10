import { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { TrendArrow } from "@/components/common/TrendArrow";
import { StatusBadge } from "@/components/common/StatusBadge";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  delta?: number;
  status?: "normal" | "warning" | "critical";
  historyData?: number[];
  variant?: "light" | "primary";
  invertTrend?: boolean; // for distance: closer = worse
}

export function SensorCard({
  title,
  value,
  unit = "",
  icon: Icon,
  trend,
  delta,
  status = "normal",
  historyData = [],
  variant = "light",
  invertTrend = false,
}: SensorCardProps) {
  const chartData = historyData.map((val, i) => ({ value: val, index: i }));

  const themeConfig = {
    light: "bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40",
    primary: "bg-gradient-to-br from-blue-600 to-blue-700 backdrop-blur-xl text-white border border-blue-500/50 shadow-lg shadow-blue-500/30",
  };

  const bgClasses = themeConfig[variant];
  const isDark = variant === "primary";

  const iconBg = {
    light: "bg-blue-50 text-blue-600",
    primary: "bg-white/20 text-white",
  };

  const iconBgClass = {
    normal: iconBg[variant],
    warning: isDark ? "bg-orange-400/30 text-orange-200" : "bg-orange-100 text-orange-600",
    critical: isDark ? "bg-red-500/30 text-red-200" : "bg-red-100 text-red-600",
  }[status];

  const chartColor = {
    normal: isDark ? "#ffffff" : "#2563eb",
    warning: "#f59e0b",
    critical: "#ef4444",
  }[status];

  const titleClass = isDark ? "text-white/70" : "text-[#78716c]";
  const valueClass = isDark ? "text-white" : "text-[#1c1c1a]";
  const unitClass = isDark ? "text-white/60" : "text-[#78716c]";

  return (
    <div className={cn("relative rounded-[1.75rem] p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl group overflow-hidden", bgClasses)}>
      {/* Accent gradient shimmer at top */}
      {!isDark && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent rounded-t-[1.75rem]" />
      )}
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-colors", iconBgClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Title & Value */}
      <div>
        <p className={cn("text-xs font-medium mb-1", titleClass)}>{title}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold tracking-tight", valueClass)}>{value}</span>
          <span className={cn("text-sm font-medium", unitClass)}>{unit}</span>
        </div>
      </div>

      {/* Trend & sparkline */}
      <div className="flex items-center justify-between">
        <TrendArrow trend={trend ?? "stable"} delta={delta} inverted={invertTrend} />
        {historyData.length > 1 && (
          <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
