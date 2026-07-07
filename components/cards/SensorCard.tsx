import { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { TrendArrow } from "@/components/common/TrendArrow";
import { StatusBadge } from "@/components/common/StatusBadge";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend: "up" | "down" | "stable";
  delta?: number;
  status?: "normal" | "warning" | "critical";
  historyData?: number[];
  variant?: "default" | "sand" | "dark";
  invertTrend?: boolean; // for distance: closer = worse
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  delta,
  status = "normal",
  historyData = [],
  variant = "default",
  invertTrend = false,
}: SensorCardProps) {
  const chartData = historyData.map((val, i) => ({ value: val, index: i }));

  const bgClasses = {
    default: "bg-white",
    sand: "bg-[#fcf7f1]",
    dark: "bg-[#5f7564]",
  }[variant];

  const isDark = variant === "dark";

  const iconBgClass = {
    normal: isDark ? "bg-white/20 text-white" : "bg-[#e1eae2] text-[#355441]",
    warning: isDark ? "bg-orange-400/30 text-orange-200" : "bg-orange-100 text-orange-600",
    critical: isDark ? "bg-red-500/30 text-red-200" : "bg-red-100 text-red-600",
  }[status];

  const chartColor = {
    normal: isDark ? "#ffffff" : "#355441",
    warning: "#f59e0b",
    critical: "#ef4444",
  }[status];

  const titleClass = isDark ? "text-white/70" : "text-[#78716c]";
  const valueClass = isDark ? "text-white" : "text-[#1c1c1a]";
  const unitClass = isDark ? "text-white/60" : "text-[#78716c]";

  return (
    <div className={cn("rounded-[2rem] p-5 shadow-sm flex flex-col gap-4 transition-shadow hover:shadow-md", bgClasses)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", iconBgClass)}>
          <Icon className="w-4 h-4" />
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
        <TrendArrow trend={trend} delta={delta} inverted={invertTrend} />
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
