"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import Image from "next/image";
import bgImage from "@/assests/tech/2150_21_6_2022_15_6_40_1_ASSAMFLOOD_21062022_02.jpg";

// ── Bento card wrapper ────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative group transition-all duration-300 hover:border-white/25 hover:shadow-blue-900/20 flex flex-col justify-between h-full ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Displays the image at its exact natural aspect ratio — zero cropping, no half-shown images.
 * w and h are the actual pixel dimensions of the source photo.
 */
function CardImage({
  src,
  alt,
  w,
  h,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden shrink-0 bg-black/50"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {/* Subtle bottom gradient so text below is clean and legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// ── Badge pill ────────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${color}`}>
      {label}
    </span>
  );
}

// ── Custom Checkmark Icon for Key Features ───────────────────────────────────
function FeatureCheckIcon() {
  return (
    <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

// ── Custom Marker Icon for Applications ──────────────────────────────────────
function ApplicationMarkerIcon() {
  return (
    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TechnologiesPage() {
  const keyFeatures = [
    "Real-time flood and water level monitoring.",
    "High-speed 5G/GSM communication for instant data transmission.",
    "Automatic LoRaWAN failover when cellular or internet networks are unavailable.",
    "Long-range wireless communication with tested coverage of approximately 2.5 km and potential transmission distances of up to 12 km under favorable conditions.",
    "Industrial-grade ultrasonic sensor with IP67 weather-resistant enclosure.",
    "Internal temperature compensation for accurate distance measurement.",
    "Multiple sensor output options: Analog, Serial, and Pulse Width.",
    "Cloud-based centralized monitoring dashboard with live data visualization.",
    "Real-time alerts and notifications for abnormal water level conditions.",
    "Suitable for rivers, dams, reservoirs, canals, bridges, urban drainage systems, and remote flood-prone locations.",
  ];

  const applications = [
    "River Water Level Monitoring",
    "Flood Early Warning Systems",
    "Dam and Reservoir Monitoring",
    "Smart City Water Infrastructure",
    "Disaster Management and Emergency Response",
    "Remote Environmental Monitoring",
    "Irrigation Canal Monitoring",
    "Critical Infrastructure Protection",
  ];

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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
        {/* Page header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3 block">
            IoT-Based Real-Time System
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Built for the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              field.
            </span>
          </h1>
          {/* Clean Lead Intro */}
          <p className="mt-4 sm:mt-6 text-white/90 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed font-light">
            Our IoT-Based Real-Time Flood Monitoring System is an intelligent, industrial-grade solution designed for continuous monitoring of river, dam, and drainage water levels in both urban and remote locations. The system delivers real-time water level and environmental data using a high-speed 5G/GSM communication network, enabling authorities to monitor flood conditions from a centralized dashboard.
          </p>

          {/* 2-Column Technical Highlights Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl pt-2">
            {/* Column 1: Dual Communication & Failover */}
            <div className="border-l-2 border-sky-400/80 pl-5 py-1">
              <p className="text-sm md:text-base text-white/75 leading-relaxed">
                To ensure uninterrupted operation during network outages or disasters, the system features a dual communication architecture. When GSM or internet connectivity becomes unavailable due to infrastructure damage or poor network coverage, the device automatically switches to LoRaWAN communication, providing reliable long-range data transmission. During field testing, the LoRaWAN network achieved a communication distance of approximately 2.5 km, with an estimated transmission capability of up to 12 km under suitable environmental conditions, making it ideal for remote and disaster-prone regions.
              </p>
            </div>

            {/* Column 2: IP67 Hardware & Sensors */}
            <div className="border-l-2 border-cyan-400/80 pl-5 py-1">
              <p className="text-sm md:text-base text-white/75 leading-relaxed">
                The monitoring unit incorporates industrial-grade ultrasonic water level sensors that are specifically designed for harsh outdoor environments. These sensors feature IP67-rated weather-resistant construction, internal temperature compensation for improved measurement accuracy, and support multiple output interfaces, including Analog, Serial, and Pulse Width, ensuring compatibility with a wide range of industrial monitoring systems.
              </p>
            </div>
          </div>
        </div>

        {/* ── BENTO GRID ARRANGED STRICTLY BY IMAGE SIZE WITH ZERO GAPS ── */}
        <div className="flex flex-col gap-6">

          {/* ════ ROW 1: Hero Video Banner (Full Width - 3 columns) ════ */}
          <Card className="flex-col md:flex-row items-center gap-0 md:gap-2 md:p-2">
            <div className="w-full md:w-[55%] shrink-0 overflow-hidden rounded-none md:rounded-[20px] bg-black border-0 md:border border-white/5 shadow-inner">
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
            <div className="flex flex-col justify-between gap-4 p-5 md:p-8 w-full h-full">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    Field Operations
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 drop-shadow-sm">
                    System Installation &amp; Testing
                  </h2>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  Watch the complete end-to-end process of bringing FloodEye to life. This footage
                  captures our hardware technology, rigorous calibration tests, and the challenging
                  field installation processes required to securely deploy sensor nodes in real-world
                  flood zones.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["5G / GSM", "LoRaWAN Failover", "IP67 Sensor", "Cloud Dashboard"].map((t) => (
                  <Badge
                    key={t}
                    label={t}
                    color="bg-indigo-500/15 text-indigo-300 border-indigo-500/20"
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* ════ ROW 2: Ultra-Wide Landscape (col-2) + Square (col-1) ════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Solar-Powered Monitoring Node (1599x720 -> 20:9 Ultra-Wide) */}
            <div className="md:col-span-2">
              <Card>
                <CardImage
                  src="/tech-field-deployment.jpeg"
                  alt="Sensor node deployed at a pond"
                  w={1599}
                  h={720}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        Field Deployment
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">
                        Solar-Powered Monitoring Node
                      </h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      The monitoring unit is deployed at the water&apos;s edge on a steel pole. A solar panel
                      provides continuous power while the weatherproof enclosure houses all electronics.
                      Suitable for rivers, dams, reservoirs, canals, bridges, urban drainage systems,
                      and remote flood-prone locations.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Solar Powered", "Steel Pole Mount", "Waterproof", "Remote Deployment"].map(
                      (t) => (
                        <Badge
                          key={t}
                          label={t}
                          color="bg-blue-500/15 text-blue-300 border-blue-500/20"
                        />
                      )
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: River-Site Calibration (1600x1600 -> 1:1 Square) */}
            <div className="md:col-span-1">
              <Card>
                <CardImage
                  src="/tech-river-testing.jpeg"
                  alt="Field testing at river site with laptop and ultrasonic sensor"
                  w={1600}
                  h={1600}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                        Live Field Testing
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1">
                        River-Site Calibration
                      </h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Engineers verify sensor accuracy on-site at the river, comparing live ultrasonic
                      readings with physical measurements. The industrial-grade ultrasonic water level
                      sensor features IP67-rated weather-resistant construction and internal temperature
                      compensation.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["IP67 Sensor", "Temp Compensation", "HTTPS Stream", "Live Validation"].map(
                      (t) => (
                        <Badge
                          key={t}
                          label={t}
                          color="bg-violet-500/15 text-violet-300 border-violet-500/20"
                        />
                      )
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ════ ROW 3: Tall Portrait (col-1) + Stack of 2 Wide Landscape Maps (col-2) ════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: LoRaWAN Gateway (720x1600 -> 9:20 Tall Portrait) */}
            <div className="md:col-span-1">
              <Card>
                <CardImage
                  src="/tech-lorawan-gateway.jpeg"
                  alt="LoRaWAN ETS IoT Gateway installed on wall"
                  w={720}
                  h={1600}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                        Dual Communication
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1">LoRaWAN Gateway</h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      When GSM or internet connectivity is unavailable due to infrastructure damage,
                      the device automatically switches to LoRaWAN — providing reliable long-range
                      data transmission during disasters. The ETS IoT Gateway handles multi-node
                      uplink aggregation and cloud forwarding.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Auto Failover", "Multi-Node", "Long-Range", "Dual Antenna"].map((t) => (
                      <Badge
                        key={t}
                        label={t}
                        color="bg-sky-500/15 text-sky-300 border-sky-500/20"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Stack of 2 Wide Landscapes (Coverage Map 12:5 + Brahmaputra Map 2:1) */}
            <div className="md:col-span-2 flex flex-col justify-between gap-6">
              {/* Top: LoRaWAN Coverage Map (1280x528 -> 12:5 Ultra-Wide Landscape) */}
              <Card className="flex-1">
                <CardImage
                  src="/tech-lora-coverage-map.jpeg"
                  alt="LoRaWAN field coverage map showing tested node distances"
                  w={1280}
                  h={528}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                        Range Testing
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">LoRaWAN Coverage Map</h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      During field testing, the LoRaWAN network achieved a communication distance of
                      approximately <strong className="text-white">2.5 km</strong>, with tested node
                      distances of 1.7 km, 2.0 km, 2.2 km, and 2.34 km across the Brahmaputra River.
                      Estimated transmission capability reaches up to{" "}
                      <strong className="text-white">12 km</strong> under suitable environmental
                      conditions — ideal for remote and disaster-prone regions.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Tested: 2.5 km", "Est. Max: 12 km", "Cross-River", "Multi-Node"].map((t) => (
                      <Badge
                        key={t}
                        label={t}
                        color="bg-teal-500/15 text-teal-300 border-teal-500/20"
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Bottom: IIT Guwahati Trials (1280x617 -> 2:1 Wide Landscape) */}
              <Card className="flex-1">
                <CardImage
                  src="/tech-brahmaputra-map.jpeg"
                  alt="Brahmaputra river aerial map showing IIT Guwahati LoRa link distance"
                  w={1280}
                  h={617}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Brahmaputra River
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">IIT Guwahati Trials</h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      The Brahmaputra Ghat test site confirmed a LoRaWAN link distance of{" "}
                      <strong className="text-white">1,920 m</strong> from IIT Guwahati&apos;s campus
                      gateway to a sensor node near Kamakhya — across the full width of the river.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "River Monitoring",
                      "Flood Early Warning",
                      "Dam & Reservoir",
                      "Remote Environments",
                    ].map((t) => (
                      <Badge
                        key={t}
                        label={t}
                        color="bg-amber-500/15 text-amber-300 border-amber-500/20"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ════ ROW 4: Landscape (col-2) + Tall Portrait (col-1) ════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Field Engineer (1280x960 -> 4:3 Landscape) */}
            <div className="md:col-span-2">
              <Card>
                <CardImage
                  src="/tech-field-engineer.jpeg"
                  alt="Engineer testing LoRa node in Guwahati"
                  w={1280}
                  h={960}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                        On-Site Testing
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">Field Testings</h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Our team conducted rigorous field trials across multiple locations in Guwahati,
                      Assam. Each node placement was GPS-logged and validated for signal strength,
                      data integrity, and end-to-end latency before final deployment. Comprehensive
                      field verification ensures reliable performance under harsh monsoon conditions.
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Field protocols included multi-point river cross-link telemetry audits,
                      packet-loss stress testing during high precipitation, and verification of IP67
                      enclosure seals under continuous moisture exposure.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["GPS-Logged Trials", "Guwahati Assam", "Signal Validation", "Low Latency"].map(
                      (t) => (
                        <Badge
                          key={t}
                          label={t}
                          color="bg-rose-500/15 text-rose-300 border-rose-500/20"
                        />
                      )
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Night Monitoring (720x1280 -> 9:16 Tall Portrait) */}
            <div className="md:col-span-1">
              <Card>
                <CardImage
                  src="/tech-night-node.jpeg"
                  alt="Sensor node operating at night with city lights in background"
                  w={720}
                  h={1280}
                />
                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                        24/7 Operation
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1">Night Monitoring</h2>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      FloodEye operates continuously day and night. The system delivers real-time water
                      level and environmental data using high-speed 5G/GSM, enabling authorities to
                      monitor flood conditions from a centralized dashboard around the clock.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Continuous Telemetry", "5G / GSM", "24/7 Surveillance", "Central Dashboard"].map(
                      (t) => (
                        <Badge
                          key={t}
                          label={t}
                          color="bg-orange-500/15 text-orange-300 border-orange-500/20"
                        />
                      )
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ════ ROW 5: Two Symmetrical 3:4 Portraits (2 columns) ════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Weatherproof Case (1200x1600 -> 3:4 Portrait) */}
            <Card>
              <CardImage
                src="/tech-enclosure-top.jpeg"
                alt="Waterproof enclosure with LoRa antenna top view"
                w={1200}
                h={1600}
              />
              <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      Hardware Enclosure
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Weatherproof Case</h2>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Industrial-grade ABS enclosure houses the microcontroller, LoRa module, GSM unit,
                    and power management electronics. Cable glands seal all sensor wires from moisture
                    and dust ingress.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["IP65/67 ABS Case", "Cable Glands", "Dust & Moisture Proof", "Compact Design"].map(
                    (t) => (
                      <Badge
                        key={t}
                        label={t}
                        color="bg-cyan-500/15 text-cyan-300 border-cyan-500/20"
                      />
                    )
                  )}
                </div>
              </div>
            </Card>

            {/* Right: Solar Unit (960x1280 -> 3:4 Portrait) */}
            <Card>
              <CardImage
                src="/tech-solar-enclosure.jpeg"
                alt="Complete solar-powered monitoring station"
                w={960}
                h={1280}
              />
              <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Power System
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Solar Unit</h2>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Standalone monitoring station with integrated solar panel and sealed enclosure.
                    Designed for unattended, continuous operation without relying on grid power
                    infrastructure.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Integrated Solar", "Off-Grid Power", "Zero Maintenance", "Energy Efficient"].map(
                    (t) => (
                      <Badge
                        key={t}
                        label={t}
                        color="bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                      />
                    )
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* ════ ROW 6: Key Features & Applications Cards (Stacked Vertically) ════ */}
          <div className="flex flex-col gap-6 mt-2">
            {/* 1. Key Features Card (Full Width) */}
            <Card className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    System Capabilities
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-1">Key Features</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                      <FeatureCheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* 2. Applications Card (Full Width Below Key Features) */}
            <Card className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Deployment Scope
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-1">Applications</h2>
                </div>
                <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {applications.map((app, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-white/90 font-medium leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-4 transition-colors hover:border-emerald-500/30"
                    >
                      <ApplicationMarkerIcon />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* ════ ROW 7: Standalone Closing Summary Text (No Card) ════ */}
          <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 text-center max-w-3xl mx-auto px-4">
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-medium italic">
              &ldquo;Our solution is designed to provide reliable, continuous, and resilient flood monitoring, ensuring that critical water level information remains available even during communication failures or natural disasters.&rdquo;
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
