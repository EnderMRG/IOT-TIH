"use client";

export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-sky-100/60" />

      {/* Wave layers — pure CSS transforms, work on all mobile browsers */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: "55vh" }}>
        {/* Layer 1 — slowest */}
        <div
          className="wave-layer absolute bottom-0 left-0 w-[200%] rounded-[50%_50%_0_0]"
          style={{
            height: "100%",
            background: "rgba(186, 230, 253, 0.22)",
            animation: "wave-x1 10s ease-in-out infinite alternate",
          }}
        />
        {/* Layer 2 — medium */}
        <div
          className="wave-layer absolute bottom-0 left-0 w-[200%] rounded-[50%_50%_0_0]"
          style={{
            height: "80%",
            background: "rgba(147, 197, 253, 0.16)",
            animation: "wave-x2 7s ease-in-out infinite alternate",
          }}
        />
        {/* Layer 3 — fastest */}
        <div
          className="wave-layer absolute bottom-0 left-0 w-[200%] rounded-[50%_50%_0_0]"
          style={{
            height: "60%",
            background: "rgba(125, 211, 252, 0.12)",
            animation: "wave-x3 5s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      <style>{`
        @keyframes wave-x1 {
          0%   { transform: translateX(0)   scaleY(1); }
          50%  { transform: translateX(-8%) scaleY(1.06); }
          100% { transform: translateX(-4%) scaleY(0.96); }
        }
        @keyframes wave-x2 {
          0%   { transform: translateX(-5%) scaleY(1); }
          50%  { transform: translateX(0)   scaleY(1.08); }
          100% { transform: translateX(-10%) scaleY(0.94); }
        }
        @keyframes wave-x3 {
          0%   { transform: translateX(-10%) scaleY(1); }
          50%  { transform: translateX(-2%)  scaleY(1.1); }
          100% { transform: translateX(-6%)  scaleY(0.92); }
        }
      `}</style>
    </div>
  );
}
