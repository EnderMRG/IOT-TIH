"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import Image from "next/image";
import bgImage from "@/assests/tech/2150_21_6_2022_15_6_40_1_ASSAMFLOOD_21062022_02.jpg";

// ── Dummy images (swap these with real component photos) ──────────────────────
// ✏️ Replace each `src` with your actual photo path
import img1 from "@/assests/landpage/guwahati-flood.jpg";       // ESP32 photo
import img2 from "@/assests/landpage/PTI06_18_2022_000030B.jpg"; // HC-SR04 photo
import img3 from "@/assests/landpage/india-weather-floods.webp"; // BME280 photo
import img4 from "@/assests/landpage/guwahati-flood.jpg";        // ThingSpeak dashboard screenshot
import img5 from "@/assests/landpage/PTI06_18_2022_000030B.jpg"; // Circuit / wiring photo
import img6 from "@/assests/landpage/india-weather-floods.webp"; // Deployment / field photo
import img7 from "@/assests/tech/2150_21_6_2022_15_6_40_1_ASSAMFLOOD_21062022_02.jpg";        // PCB / enclosure photo

// ── Bento cell ────────────────────────────────────────────────────────────────

function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl overflow-hidden relative group transition-all duration-300 hover:border-white/25 hover:shadow-blue-900/20 ${className}`}
    >
      {children}
    </div>
  );
}

// ── Shared image header ───────────────────────────────────────────────────────

function CardImage({
  src,
  alt,
  height = "h-48",
  objectPosition = "object-center",
}: {
  src: Parameters<typeof Image>[0]["src"];
  alt: string;
  height?: string;
  objectPosition?: string;
}) {
  return (
    <div className={`relative w-full ${height} shrink-0`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover ${objectPosition} transition-transform duration-500 group-hover:scale-[1.03]`}
      />
      {/* Subtle dark gradient at bottom so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <LandingNav />

      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt="Flood background"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-24">

        {/* Page header */}
        <div className="mb-14">

          <h1 className="font-sans text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Built with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              precision.
            </span>
          </h1>
          <p className="mt-5 text-white/90 drop-shadow-sm text-lg max-w-xl leading-relaxed">
            Every component of FloodEye was selected for reliability — from the
            sensor submerged in floodwater to the browser dashboard.
          </p>
        </div>

        {/* ── Bento grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Featured Video Showcase */}
          <Cell className="md:col-span-3 flex flex-col md:flex-row items-center gap-2 p-2">
            <div className="w-full md:w-[55%] shrink-0 overflow-hidden rounded-[20px] bg-black border border-white/5 shadow-inner">
              <video
                src="/flood_monitoring_system.mp4?v=2"
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto aspect-video object-contain"
                preload="metadata"
              />
            </div>
            <div className="flex flex-col gap-3 p-6 md:p-8 w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Field Operations</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 drop-shadow-sm">System Installation &amp; Testing</h2>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Watch the complete end-to-end process of bringing FloodEye to life. This footage captures our hardware technology, rigorous calibration tests, and the challenging field installation processes required to securely deploy our sensor nodes in real-world flood zones.
              </p>
            </div>
          </Cell>

          {/* ── Row 1 ── */}

          {/* ESP32 — tall hero, 2 cols */}
          <Cell className="md:col-span-2 flex flex-col">
            <CardImage src={img1} alt="ESP32 microcontroller" height="h-56" />
            <div className="p-7 flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Microcontroller</span>
                <h2 className="text-2xl font-bold text-white mt-1">ESP32</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                Dual-core 240 MHz chip with built-in Wi-Fi. Reads all sensors and
                pushes telemetry to ThingSpeak every 15 s over HTTPS. Runs on a
                single LiPo battery with deep-sleep between readings.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Wi-Fi 802.11 b/g/n", "Dual-core Xtensa LX6", "HTTPS", "Deep Sleep"].map((t) => (
                  <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Cell>

          {/* HC-SR04 */}
          <Cell className="flex flex-col">
            <CardImage src={img2} alt="HC-SR04 ultrasonic sensor" height="h-44" objectPosition="object-top" />
            <div className="p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Distance Sensor</span>
              <h2 className="text-xl font-bold text-white">HC-SR04</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                Ultrasonic sensor that measures water level by timing the echo of a
                40 kHz pulse. Range 2–400 cm, accuracy ±3 mm.
              </p>
            </div>
          </Cell>

          {/* ── Row 2 ── */}

          {/* BME280 */}
          <Cell className="flex flex-col">
            <CardImage src={img3} alt="BME280 sensor" height="h-40" />
            <div className="p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Environment Sensor</span>
              <h2 className="text-xl font-bold text-white">BME280</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                Measures temperature, humidity and atmospheric pressure. Sampled
                at 1 Hz to provide environmental context alongside water-level data.
              </p>
            </div>
          </Cell>

          {/* ThingSpeak dashboard screenshot — wide */}
          <Cell className="md:col-span-2 flex flex-col">
            <CardImage src={img4} alt="ThingSpeak dashboard screenshot" height="h-48" objectPosition="object-top" />
            <div className="p-7 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">IoT Cloud Platform</span>
              <h2 className="text-xl font-bold text-white">ThingSpeak</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                MathWorks cloud platform that ingests sensor data via HTTPS REST
                API. Stores timestamped field history and serves it to the Next.js
                backend through read-only API keys.
              </p>
            </div>
          </Cell>

          {/* ── Row 3 ── */}

          {/* Circuit / wiring photo — wide */}
          <Cell className="md:col-span-2 flex flex-col">
            <CardImage src={img5} alt="Circuit wiring" height="h-48" />
            <div className="p-7 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Wiring &amp; Circuit</span>
              <h2 className="text-xl font-bold text-white">Hardware Assembly</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                All sensors connect to the ESP32 via 3.3 V I²C (BME280) and
                GPIO trigger/echo (HC-SR04). A voltage regulator and bypass
                capacitors ensure stable readings in field conditions.
              </p>
            </div>
          </Cell>

          {/* Deployment / field photo */}
          <Cell className="flex flex-col">
            <CardImage src={img6} alt="Field deployment" height="h-44" />
            <div className="p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Field Deployment</span>
              <h2 className="text-xl font-bold text-white">Installation</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                The sensor unit is mounted above a waterway on a PVC pole.
                Waterproof enclosure protects electronics from rain and splash.
              </p>
            </div>
          </Cell>

          {/* ── Row 4 ── */}

          {/* Enclosure / PCB photo */}
          <Cell className="flex flex-col">
            <CardImage src={img7} alt="PCB enclosure" height="h-44" />
            <div className="p-6 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Enclosure</span>
              <h2 className="text-xl font-bold text-white">Waterproof Case</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {/* ✏️ Replace with your actual description */}
                IP65-rated ABS enclosure houses the ESP32, power module and
                connectors. Cable glands seal all sensor wires from moisture.
              </p>
            </div>
          </Cell>



        </div>
      </main>
    </div>
  );
}
