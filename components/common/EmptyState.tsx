import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
      <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
        <Icon className="w-8 h-8 opacity-50" />
      </div>
      <p className="font-semibold text-sm text-zinc-500">{title}</p>
      {description && <p className="text-xs text-center max-w-xs">{description}</p>}
    </div>
  );
}
