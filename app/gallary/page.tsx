"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import Image from "next/image";
import { StaticImageData } from "next/image";

import { LayoutGrid } from "@/components/ui/layout-grid";

// ── Static image imports (webpack-resolved) ───────────────────────────────────
import img1 from "@/assests/gallery/New folder/WhatsApp Image 2022-03-24 at 11.45.06 AM (1).jpeg";
import img2 from "@/assests/gallery/New folder/WhatsApp Image 2022-08-30 at 3.35.29 PM.jpeg";
import img3 from "@/assests/gallery/New folder/WhatsApp Image 2022-09-25 at 11.29.04 AM.jpeg";
import img4 from "@/assests/gallery/New folder/WhatsApp Image 2023-04-18 at 10.15.54 AM.jpeg";
import img5 from "@/assests/gallery/New folder/WhatsApp Image 2023-04-18 at 10.16.45 AM (1).jpeg";
import img6 from "@/assests/gallery/New folder/WhatsApp Image 2024-09-23 at 11.19.40 AM(1).jpeg";
import img7 from "@/assests/gallery/New folder/WhatsApp Image 2024-09-23 at 11.19.41 AM.jpeg";

// ── Card content (shown on expand) ───────────────────────────────────────────

const CardOne = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Hydrological Lab Calibration</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      Researchers preparing the physical flume model for hydrodynamic testing and sensor calibration in a controlled laboratory environment before field deployment.
    </p>
  </div>
);

const CardTwo = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Initial Prototype Assembly</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      The team assembling the initial solar-powered sensor node prototype on a wooden pole near an experimental water body to test structural balance and wiring.
    </p>
  </div>
);

const CardThree = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">The FloodEye Node</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      A close-up view of the fully assembled IoT node, featuring a solar panel, power management module, and the main weatherproof enclosure that houses the ESP32 and telemetry logic.
    </p>
  </div>
);

const CardFour = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Field Testing Phase</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      The FloodEye sensor node successfully deployed in a shallow test pond, demonstrating its ability to operate autonomously on solar power while transmitting real-time water levels.
    </p>
  </div>
);

const CardFive = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Successful Integration</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      A team member proudly inspecting the deployed sensor node. This phase verified the wireless data transmission capabilities and the stability of the mounting pole.
    </p>
  </div>
);

const CardSix = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Bridge Deployment Security</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      Overhead view of a sensor node installed on a bridge over a river. A custom barbed wire enclosure was added to protect the solar panel from theft and vandalism in remote locations.
    </p>
  </div>
);

const CardSeven = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white drop-shadow-sm">Rugged River Installation</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/90 leading-relaxed drop-shadow-sm">
      Field engineers executing a challenging installation, lowering a heavy-duty protective cage containing the sensor equipment down the side of a concrete river embankment into fast-flowing water.
    </p>
  </div>
);

// ── Card definitions ──────────────────────────────────────────────────────────

const cards = [
  {
    id: 1,
    content: <CardOne />,
    className: "md:col-span-2",
    thumbnail: img1,
  },
  {
    id: 2,
    content: <CardTwo />,
    className: "col-span-1",
    thumbnail: img2,
  },
  {
    id: 3,
    content: <CardThree />,
    className: "col-span-1",
    thumbnail: img3,
  },
  {
    id: 4,
    content: <CardFour />,
    className: "md:col-span-2",
    thumbnail: img4,
  },
  {
    id: 5,
    content: <CardFive />,
    className: "md:col-span-2",
    thumbnail: img5,
  },
  {
    id: 6,
    content: <CardSix />,
    className: "col-span-1",
    thumbnail: img6,
  },
  {
    id: 7,
    content: <CardSeven />,
    className: "md:col-span-3",
    thumbnail: img7,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <LandingNav />

      {/* Fixed background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/INDIA-WEATHER-FLOOD.avif"
          alt="Flood background"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-12">
          {/* <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
            Photos &amp; Field Work
          </p> */}
          <h1 className="font-sans text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Gallery
          </h1>
          <p className="mt-5 text-white/90 drop-shadow-sm text-lg max-w-xl leading-relaxed">
            A visual record of the floods that motivated FloodEye, the hardware
            we built, and the team that built it.
            <span className="block mt-1 text-sm text-white/75">Click any photo to expand.</span>
          </p>
        </div>

        {/* Grid */}
        <LayoutGrid cards={cards} />
      </main>
    </div>
  );
}
