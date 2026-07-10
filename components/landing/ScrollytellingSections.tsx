"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
  Radio,
  Zap,
  Map,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

/* Dynamically imported so MapLibre CSS doesn't SSR */
const AssamNodeMap = dynamic(
  () => import("@/components/landing/AssamNodeMap"),
  {
    ssr: false, loading: () => (
      <div className="w-full h-[340px] rounded-2xl bg-white/5 animate-pulse" />
    )
  }
);

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

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="text-base sm:text-lg italic font-medium text-cyan-300 mb-10 text-center"
        >
          &ldquo;Every Drop Monitored, Every Life Protected.&rdquo;
        </motion.p>


        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-base md:text-xl text-white drop-shadow-md max-w-lg mx-auto leading-relaxed mb-6"
        >
          Real-time flood monitoring and early warning powered by ESP32 sensor
          networks — keeping communities safe when it matters most.
        </motion.p>




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
/*  SECTION 4 — Sensor Network Map                                 */
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

          {/* Left: description */}
          <FadeIn direction="left">
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Sensor Network
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Deployed across
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Assam's floodplains.
              </span>
            </h2>
            <p className="text-white/65 leading-relaxed text-base mb-8">
              FloodEye's ESP32 nodes are strategically deployed at high-risk
              flood zones across Assam — from the Brahmaputra riverbanks to the
              Barak Valley wetlands. Each node transmits water level, temperature,
              humidity and pressure readings in real-time, enabling early warning
              for downstream communities before disaster strikes.
            </p>

            {/* Node status legend */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { color: "bg-emerald-400", border: "border-emerald-400/30", label: "Normal", desc: "Water within safe range" },
                { color: "bg-amber-400", border: "border-amber-400/30", label: "Warning", desc: "Approaching threshold" },
                { color: "bg-red-400", border: "border-red-400/30", label: "Critical", desc: "Immediate alert dispatched" },
              ].map(({ color, border, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl border ${border} bg-white/5 flex items-center justify-center flex-shrink-0`}>
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                  </div>
                  <div>
                    <span className="text-white text-sm font-semibold">{label}</span>
                    <span className="text-white/45 text-xs ml-2">{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Radio, label: "4 active nodes deployed" },
                { icon: Zap, label: "Sub-second alert propagation" },
                { icon: Map, label: "Geo-tagged sensor network" },
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

          {/* Right: Assam Map */}
          <FadeIn direction="right" delay={0.2}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/60 font-mono tracking-wide">
                  LIVE · SENSOR NETWORK · ASSAM, INDIA
                </span>
              </div>
              <AssamNodeMap />
              <div className="mt-4 p-3 rounded-xl border border-blue-500/20 bg-blue-500/10">
                <p className="text-xs text-blue-300 font-medium">
                  📡 4 nodes online · Last sync: just now · Coverage: 4 districts
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
/*  SVG brand icons                                                */
/* ─────────────────────────────────────────────────────────────── */
function IconGitHub({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconInstagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION 5 — Contact Us                                         */
/* ─────────────────────────────────────────────────────────────── */
function ContactSection() {
  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "moharnab.gogoi@gmail.com",
      href: "mailto:moharnab.gogoi@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: MapPin,
      label: "Address",
      value:
        "4th Floor, Research & Development Building, IIT Guwahati Campus, North Guwahati, Assam – 781039",
      href: "https://maps.google.com/?q=IIT+Guwahati",
    },
  ];

  const socials = [
    {
      label: "GitHub",
      href: "https://github.com/EnderMRG/IOT-TIH",
      Icon: IconGitHub,
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      Icon: IconInstagram,
    },
    {
      label: "X",
      href: "https://x.com",
      Icon: IconX,
    },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-32"
    >
      {/* background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">

        {/* ── Header ── */}
        <FadeIn className="text-center mb-16">
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Get in Touch
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Contact
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {" "}Us.
            </span>
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto mt-4 leading-relaxed">
            Have questions about FloodEye or want to collaborate? Reach out —
            we&apos;re happy to help.
          </p>
        </FadeIn>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          {/* Left — contact details */}
          <FadeIn direction="left" className="flex flex-col gap-4">
            {contactDetails.map(({ icon: Icon, label, value, href }, i) => (
              <a
                key={label}
                href={href}
                target={label === "Address" ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl border border-blue-400/30 bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mb-1">
                    {label}
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </FadeIn>

          {/* Right — CTA card */}
          <FadeIn direction="right" delay={0.15}>
            <GlassCard className="p-8 flex flex-col items-center text-center gap-6 h-full justify-center">
              <div className="w-16 h-16 rounded-2xl border border-blue-400/30 bg-blue-500/15 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="font-sans text-2xl font-bold text-white mb-2">
                  Drop us a mail
                </h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                  Whether it&apos;s a partnership inquiry, technical question,
                  or feedback — we read every message.
                </p>
              </div>
              <a
                href="mailto:moharnab.gogoi@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 text-sm"
              >
                <Mail className="w-4 h-4" />
                Mail Us
              </a>
              <p className="text-white/30 text-xs">We typically respond within 24 hours.</p>
            </GlassCard>
          </FadeIn>
        </div>

        {/* ── Divider ── */}
        <FadeIn delay={0.2}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
        </FadeIn>

        {/* ── Footer bar ── */}
        <FadeIn delay={0.25} className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-blue-500/30">
              <Image src="/FloodEye.jpeg" alt="FloodEye" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                Flood<span className="text-blue-400">Eye</span>
              </span>
              <p className="text-white/35 text-xs">
                Developed under TIH · IIT Guwahati
              </p>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/8 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 hover:bg-white/15 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white/30 text-xs text-center">
            © {new Date().getFullYear()} FloodEye · IIT Guwahati. All rights reserved.
          </p>
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
      <ContactSection />
    </div>
  );
}
