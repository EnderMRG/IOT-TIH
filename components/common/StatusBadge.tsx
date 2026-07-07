import { cn } from "@/lib/utils";

type StatusType = "normal" | "warning" | "critical" | "offline" | "online" | "good" | "moderate" | "poor" | "excellent";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  normal:    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  defaultLabel: "Normal" },
  online:    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  defaultLabel: "Online" },
  good:      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  defaultLabel: "Good" },
  excellent: { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500",defaultLabel: "Excellent" },
  warning:   { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", defaultLabel: "Warning" },
  moderate:  { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", defaultLabel: "Moderate" },
  critical:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    defaultLabel: "Critical" },
  poor:      { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    defaultLabel: "Poor" },
  offline:   { bg: "bg-zinc-100",  text: "text-zinc-600",   dot: "bg-zinc-400",   defaultLabel: "Offline" },
};

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-semibold rounded-full",
      cfg.bg, cfg.text,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
    )}>
      <span className={cn("rounded-full shrink-0", cfg.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {label ?? cfg.defaultLabel}
    </span>
  );
}
