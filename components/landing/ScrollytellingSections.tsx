"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  Droplets,
  ExternalLink,
  ChevronDown,
  Radio,
  Zap,
  Map,
} from "lucide-react";

/* ── Reusable Fade-in wrapper ──────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Glass card ────────────────────────────────────────────────── */
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  sub,
  delay,
}: {
  value: string;
  label: string;
  sub: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} direction="up">
      <GlassCard className="p-4 sm:p-6 text-center">
        <p className="font-sans text-3xl sm:text-4xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-semibold text-blue-300">{label}</p>
        <p className="text-xs text-white/60 mt-0.5">{sub}</p>
      </GlassCard>
    </FadeIn>
  );
}

/* ── Feature card ──────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay}>
      <GlassCard className="p-7 flex flex-col gap-4 h-full hover:bg-white/15 transition-colors duration-300">
        <div className="w-11 h-11 rounded-2xl border border-blue-400/30 bg-blue-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-300" />
        </div>
        <h3 className="font-sans text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
      </GlassCard>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 1 — Hero                                               */
/* ─────────────────────────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20"
    >
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-5xl mx-auto">

        {/* TIH & IIT Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 bg-white/10 backdrop-blur-md border border-white/20 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-2xl">
            <span className="text-sm sm:text-base font-semibold text-white/90 tracking-wide">Developed under</span>
            <div className="hidden sm:block w-px h-10 bg-white/20 rounded-full"></div>
            <Image src="/logotih.png" alt="TIH" width={110} height={44} className="object-contain drop-shadow-md" />
            <Image src="/iitlogo.png" alt="IIT Guwahati" width={48} height={48} className="object-contain drop-shadow-md" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
          className="font-sans text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold text-white leading-[0.9] tracking-tight mb-6"
        >
          Flood
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Eye.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-base md:text-xl text-white drop-shadow-md max-w-lg mx-auto leading-relaxed mb-10"
        >
          Real-time flood monitoring and early warning powered by ESP32 sensor
          networks — keeping communities safe when it matters most.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/login"
            className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 text-sm"
          >
            Open Dashboard →
          </Link>
          <a
            href="https://github.com/EnderMRG/IOT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4" /> GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 pointer-events-none"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll to explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 2 — Capabilities                                       */
/* ─────────────────────────────────────────────────────────────── */
function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/60 pointer-events-none" />
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Platform Capabilities
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Real-time data.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Real impact.
            </span>
          </h2>
          <p className="text-white drop-shadow-md max-w-xl mx-auto mt-4 text-base leading-relaxed">
            Our multi-sensor nodes transmit readings every 15 seconds, powering
            a live dashboard visible to emergency responders and communities alike.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-12">
          <StatCard value="5+" label="Sensor Types" sub="per node" delay={0} />
          <StatCard value="15s" label="Refresh Rate" sub="live readings" delay={0.1} />
          <StatCard value="24/7" label="Uptime" sub="continuous monitoring" delay={0.2} />
          <StatCard value="100%" label="Open Source" sub="MIT licensed" delay={0.3} />
        </div>

        <FadeIn className="flex flex-wrap justify-center gap-3" delay={0.4}>
          {["Temperature", "Humidity", "Pressure", "Altitude", "Water Level"].map((s) => (
            <div
              key={s}
              className="px-4 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium"
            >
              {s}
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 3 — Feature Grid                                       */
/* ─────────────────────────────────────────────────────────────── */
function FeatureGridSection() {
  return (
    <section
      id="features"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/60 pointer-events-none" />
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-12">
        <FadeIn className="text-center">
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Platform Features
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Built for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              emergency response.
            </span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Activity}
            title="Live Monitoring"
            desc="Water levels reported every 15 seconds from ultrasonic sensors across all deployed nodes."
            delay={0}
          />
          <FeatureCard
            icon={AlertTriangle}
            title="Instant Alerts"
            desc="Threshold-based notifications when water levels reach warning or critical zones."
            delay={0.1}
          />
          <FeatureCard
            icon={Shield}
            title="Comfort Score"
            desc="0–100 environment score combining temperature, humidity, and pressure data."
            delay={0.2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Clock}
            title="Historical Analytics"
            desc="Interactive time-series charts — filter by hour, day, week or month."
            delay={0}
          />
          <FeatureCard
            icon={Radio}
            title="ESP32 Integration"
            desc="Plug-and-play firmware for ESP32 microcontrollers with I2C sensor support."
            delay={0.1}
          />
          <FeatureCard
            icon={Zap}
            title="ThingSpeak Sync"
            desc="Push data to ThingSpeak IoT cloud for remote logging and long-term storage."
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 4 — Data & Alerting                                    */
/* ─────────────────────────────────────────────────────────────── */
function DataAlertingSection() {
  return (
    <section
      id="data-alerting"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/70 pointer-events-none" />
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <FadeIn direction="left">
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Data Integration
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Sensor to screen
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                in milliseconds.
              </span>
            </h2>
            <p className="text-white/65 leading-relaxed text-base mb-8">
              Our ESP32 nodes read multi-sensor telemetry and push it over
              Wi-Fi directly to the dashboard. When water levels spike, automated
              alerts fire before downstream communities are at risk.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: Radio, label: "ESP32 → Wi-Fi → Dashboard" },
                { icon: Zap, label: "Sub-second alert propagation" },
                { icon: Map, label: "Geo-tagged sensor network map" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-xl border border-blue-400/30 bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right: live data card */}
          <FadeIn direction="right" delay={0.2}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/60 font-mono tracking-wide">
                  LIVE · NODE-04 · RIVER CROSSING
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Water Level", value: "1.42 m", alert: true },
                  { label: "Temperature", value: "24.1°C", alert: false },
                  { label: "Humidity", value: "87%", alert: false },
                  { label: "Comfort", value: "62 / 100", alert: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`p-4 rounded-2xl border ${
                      item.alert
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <p className="text-xs text-white/50 mb-1">{item.label}</p>
                    <p
                      className={`text-xl font-bold font-mono ${
                        item.alert ? "text-red-400" : "text-white"
                      }`}
                    >
                      {item.value}
                    </p>
                    {item.alert && (
                      <p className="text-[10px] text-red-400 mt-1 font-semibold tracking-wide">
                        ⚠ WARNING THRESHOLD
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl border border-orange-500/20 bg-orange-500/10">
                <p className="text-xs text-orange-300 font-medium">
                  🔔 Alert sent to 3 downstream stations — 12s ago
                </p>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 5 — CTA                                                */
/* ─────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section
      id="cta"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90 pointer-events-none" />
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8">
        <FadeIn>
          <div className="w-20 h-20 rounded-3xl border border-blue-400/30 bg-blue-500/15 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4">
            <Droplets className="w-10 h-10 text-blue-400" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[0.95] tracking-tight">
            Start monitoring
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              your community.
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-white/65 text-base max-w-md leading-relaxed">
            Connect your ESP32, open the dashboard, and get real-time flood
            sensor data. No cloud account required.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-9 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 text-sm"
          >
            Open Dashboard →
          </Link>
          <a
            href="https://github.com/EnderMRG/IOT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-9 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4" /> View on GitHub
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Root export                                                     */
/* ─────────────────────────────────────────────────────────────── */
export function ScrollytellingSections() {
  return (
    <div className="relative z-10">
      <HeroSection />
      <CapabilitiesSection />
      <FeatureGridSection />
      <DataAlertingSection />
      <CTASection />
    </div>
  );
}
