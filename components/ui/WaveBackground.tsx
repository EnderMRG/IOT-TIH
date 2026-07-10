"use client";

export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient matching light slate theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50/50" />

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave layer 1 — slowest, most opaque */}
        <path
          className="wave-1"
          fill="rgba(186, 230, 253, 0.20)"
          d="M0,280 C180,230 360,190 540,220 C720,250 900,310 1080,290 C1260,270 1380,230 1440,220 L1440,560 L0,560 Z"
        />
        {/* Wave layer 2 — medium speed */}
        <path
          className="wave-2"
          fill="rgba(147, 197, 253, 0.14)"
          d="M0,320 C200,290 400,250 600,280 C800,310 1000,360 1200,340 C1320,328 1400,300 1440,290 L1440,560 L0,560 Z"
        />
        {/* Wave layer 3 — fastest, most transparent */}
        <path
          className="wave-3"
          fill="rgba(125, 211, 252, 0.10)"
          d="M0,360 C160,340 340,300 520,330 C700,360 880,400 1060,385 C1240,370 1360,340 1440,330 L1440,560 L0,560 Z"
        />
      </svg>

      {/* Subtle top shimmer line for depth */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      <style jsx>{`
        .wave-1 {
          animation: wave-flow-1 10s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }
        .wave-2 {
          animation: wave-flow-2 7s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }
        .wave-3 {
          animation: wave-flow-3 5s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }

        @keyframes wave-flow-1 {
          0% {
            d: path("M0,280 C180,230 360,190 540,220 C720,250 900,310 1080,290 C1260,270 1380,230 1440,220 L1440,560 L0,560 Z");
          }
          50% {
            d: path("M0,300 C180,260 360,300 540,270 C720,240 900,260 1080,300 C1260,340 1380,270 1440,260 L1440,560 L0,560 Z");
          }
          100% {
            d: path("M0,260 C200,300 400,240 600,265 C800,290 1000,270 1200,300 C1360,325 1420,260 1440,250 L1440,560 L0,560 Z");
          }
        }

        @keyframes wave-flow-2 {
          0% {
            d: path("M0,320 C200,290 400,250 600,280 C800,310 1000,360 1200,340 C1320,328 1400,300 1440,290 L1440,560 L0,560 Z");
          }
          50% {
            d: path("M0,340 C200,310 400,370 600,340 C800,310 1000,330 1200,360 C1320,378 1400,350 1440,340 L1440,560 L0,560 Z");
          }
          100% {
            d: path("M0,305 C220,340 440,290 640,320 C840,350 1020,310 1220,330 C1360,344 1420,320 1440,310 L1440,560 L0,560 Z");
          }
        }

        @keyframes wave-flow-3 {
          0% {
            d: path("M0,360 C160,340 340,300 520,330 C700,360 880,400 1060,385 C1240,370 1360,340 1440,330 L1440,560 L0,560 Z");
          }
          50% {
            d: path("M0,380 C180,360 360,380 540,360 C720,340 900,370 1080,390 C1240,405 1360,375 1440,365 L1440,560 L0,560 Z");
          }
          100% {
            d: path("M0,345 C180,370 380,340 560,365 C740,390 920,360 1100,375 C1280,390 1380,360 1440,350 L1440,560 L0,560 Z");
          }
        }
      `}</style>
    </div>
  );
}
