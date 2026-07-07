export function LoadingSkeleton({ count = 1, className }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-[2rem] bg-zinc-100 animate-pulse ${className ?? "h-40"}`}
        />
      ))}
    </>
  );
}
