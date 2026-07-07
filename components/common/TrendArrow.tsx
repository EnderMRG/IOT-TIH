import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendArrowProps {
  trend: "up" | "down" | "stable";
  delta?: number;
  inverted?: boolean; // For metrics where "up" is bad (e.g. distance closeness)
  className?: string;
}

export function TrendArrow({ trend, delta, inverted = false, className }: TrendArrowProps) {
  const isBad = (trend === "up" && !inverted) || (trend === "down" && inverted);
  const isGood = (trend === "down" && !inverted) || (trend === "up" && inverted);

  const colorClass = isGood
    ? "text-[#355441]"
    : isBad
    ? "text-[#e07a5f]"
    : "text-zinc-400";

  return (
    <div className={cn("flex items-center gap-1 text-xs font-semibold", colorClass, className)}>
      {trend === "up" && <TrendingUp className="w-4 h-4" />}
      {trend === "down" && <TrendingDown className="w-4 h-4" />}
      {trend === "stable" && <Minus className="w-4 h-4" />}
      {delta !== undefined && (
        <span>{delta > 0 ? "+" : ""}{delta.toFixed(1)}</span>
      )}
    </div>
  );
}
