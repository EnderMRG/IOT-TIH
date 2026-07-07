import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "1h",  label: "Last Hour" },
  { id: "6h",  label: "Last 6 Hours" },
  { id: "24h", label: "Last 24 Hours" },
  { id: "1w",  label: "Last Week" },
  { id: "1m",  label: "Last Month" },
];

interface TimeFilterProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function TimeFilter({ value, onChange, className }: TimeFilterProps) {
  return (
    <div className={cn("flex bg-white border border-zinc-100 rounded-full shadow-sm p-1 overflow-x-auto", className)}>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
            value === f.id
              ? "bg-[#355441] text-white shadow-sm"
              : "text-zinc-500 hover:text-[#1c1c1a] hover:bg-zinc-50"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
