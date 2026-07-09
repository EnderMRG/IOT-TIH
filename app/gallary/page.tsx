"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import Image from "next/image";
import { StaticImageData } from "next/image";
import bgImage from "@/assests/gallery/INDIA-WEATHER-FLOOD-1_1720160942946_1720160977489.avif";
import { LayoutGrid } from "@/components/ui/layout-grid";

// ── Static image imports (webpack-resolved) ───────────────────────────────────
import imgGuwahati   from "@/assests/landpage/guwahati-flood.jpg";
import imgPTI        from "@/assests/landpage/PTI06_18_2022_000030B.jpg";
import imgWeather    from "@/assests/landpage/india-weather-floods.webp";
import imgFloodMain  from "@/assests/about page/flood-main-1782292399476_d.webp";

// ── Card content (shown on expand) ───────────────────────────────────────────
// ✏️ Replace titles and descriptions with your real captions

const CardOne = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">Flooding in Guwahati</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      Aerial view of the 2022 Assam floods, showing the extent of inundation
      across low-lying neighbourhoods in Guwahati. Captured to document
      baseline flood conditions for the FloodEye project.
    </p>
  </div>
);

const CardTwo = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">River Overflowing</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      The Brahmaputra river breaching its banks during peak monsoon season.
      FloodEye sensor nodes were deployed at sites like this to track
      rising water in real time.
    </p>
  </div>
);

const CardThree = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">Relief Operations</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      NDRF teams conducting relief operations in a flooded village. Early
      warning data from systems like FloodEye helps pre-position rescue
      teams before water levels become critical.
    </p>
  </div>
);

const CardFour = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">India Weather Floods</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      Monsoon-driven flooding across central India. The pattern of
      recurring annual floods highlights the urgent need for affordable,
      scalable IoT early-warning infrastructure.
    </p>
  </div>
);

const CardFive = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">Sensor Deployment Site</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      A FloodEye measurement station mounted above a canal. The ESP32
      and HC-SR04 ultrasonic sensor are enclosed in a weatherproof casing
      attached to a PVC standpipe.
    </p>
  </div>
);

const CardSix = () => (
  <div>
    <p className="font-bold text-2xl md:text-4xl text-white">Dashboard in Action</p>
    <p className="font-normal text-sm md:text-base mt-3 max-w-lg text-white/75 leading-relaxed">
      {/* ✏️ Replace with real caption */}
      The FloodEye real-time dashboard displaying live water-level telemetry,
      environmental metrics and automated flood-risk alerts, as seen
      during a field test.
    </p>
  </div>
);

// ── Card definitions ──────────────────────────────────────────────────────────
// ✏️ Replace `thumbnail` paths with your actual gallery photos

const cards = [
  {
    id: 1,
    content: <CardOne />,
    className: "md:col-span-2",
    thumbnail: imgGuwahati,          // ✏️ swap with your photo import
  },
  {
    id: 2,
    content: <CardTwo />,
    className: "col-span-1",
    thumbnail: imgPTI,               // ✏️ swap with your photo import
  },
  {
    id: 3,
    content: <CardThree />,
    className: "col-span-1",
    thumbnail: imgWeather,           // ✏️ swap with your photo import
  },
  {
    id: 4,
    content: <CardFour />,
    className: "md:col-span-2",
    thumbnail: imgFloodMain,         // ✏️ swap with your photo import
  },
  {
    id: 5,
    content: <CardFive />,
    className: "col-span-1",
    thumbnail: imgPTI,               // ✏️ swap with your photo import
  },
  {
    id: 6,
    content: <CardSix />,
    className: "md:col-span-2",
    thumbnail: imgGuwahati,          // ✏️ swap with your photo import
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
          src={bgImage}
          alt="Flood background"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
            Photos &amp; Field Work
          </p>
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
