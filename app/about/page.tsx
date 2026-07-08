"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { Users } from "lucide-react";
import Image from "next/image";

/* ── Glass card ────────────────────────────────────────────────── */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-md shadow-xl ${className}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  const team = [
    { name: "Ashish Kumar Mahato", role: "Mentor" },
    { name: "Aryyaman Bora", role: "Frontend and UI Design" },
    { name: "Moharnab Gogoi", role: "Backend and IoT" },
    { name: "Mayuree Khanikar", role: "Research and Documentation" },
    { name: "Indrani Gogoi", role: "Research and Documentation" },
  ];

  const mentors = [
    { name: "Dr. Pratiksha Sharma", role: "Co-ordinator" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <LandingNav />

      {/* Background vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* About TIH Section */}
        <section className="mb-24">
          <h2 className="font-sans text-4xl font-bold text-slate-900 mb-8">About TIH</h2>

          <GlassCard className="p-8 md:p-10">
            {/* Header: Title on left, Logo on right */}
            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 mb-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">Technology Innovation Hub</h3>
                <p className="text-blue-600 font-medium text-lg">IIT Guwahati</p>
              </div>
              <div className="shrink-0 flex justify-start md:justify-end">
                <Image src="/logotih.png" alt="TIH" width={160} height={160} className="object-contain drop-shadow-md" />
              </div>
            </div>

            {/* Content taking full width below */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Introduction</h3>
                <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                  <strong className="text-slate-900">Technology for Underwater Exploration</strong><br />
                  Developing Technology for Underwater system development, Underwater vision, Underwater Monitoring and Surveillance and Intelligent tracking.
                </p>
              </div>
    
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                  Indigenous design and development of Mechanical Structures, Prime Movers, Sensors, Controllers, Software, and Communication systems, for underwater application will be the prime focus of this Technology Innovation Hub (TIH). IIT Guwahati will provide a platform for bringing the experts together for generation of the knowledge through basic and applied research which can lead to generate several entrepreneurs, start-up companies, skill developments, jobs, and research opportunities in this area.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
        {/* About the Project Section */}
        <section className="mb-24">
          <h1 className="font-sans text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8">
            About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Project</span>
          </h1>

          <GlassCard className="p-8 md:p-10">
            <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium mb-6">
              We have done this project under TIH IIT Guwahati under the mentorship of Sir Ashish Kumar Mahato and Co-ordinator Dr. Pratiksha Sharma.
            </p>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-lg">
              <p>
                FloodEye was conceived as a rapid-response solution to mitigate the catastrophic impacts of sudden urban and rural flooding. By deploying a low-cost, highly reliable mesh of ESP32 ultrasonic sensor nodes across vulnerable waterways, we can detect rising water levels in real-time before they breach critical thresholds.
              </p>
              <p>
                The platform securely streams meteorological telemetry—including water depth, atmospheric pressure, and humidity—directly to a centralized dashboard. This allows early warning signals to be dispatched to local authorities and residents instantly, buying precious time for evacuation and disaster response. Our ultimate goal is to provide a scalable, open-source early warning infrastructure that protects lives and properties globally.
              </p>
            </div>
          </GlassCard>
        </section>



        {/* Mentor Details Section */}
        {/*<section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl border border-blue-400/30 bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="font-sans text-4xl font-bold text-white">Mentor Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <GlassCard key={mentor.name} className="p-6 flex flex-col items-center text-center hover:bg-white/15 transition-colors duration-300">
                <div className="w-28 h-28 rounded-full mb-5 bg-gradient-to-br from-indigo-700 to-indigo-900 border-2 border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <svg className="w-14 h-14 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-white mb-1">{mentor.name}</h3>
                <p className="text-sm font-medium text-blue-300">{mentor.role}</p>
              </GlassCard>
            ))}
          </div>
        </section>*/}

        {/* Team Details Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl border border-blue-400/30 bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="font-sans text-4xl font-bold text-slate-900">Team Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <GlassCard key={member.name} className="p-6 flex flex-col items-center text-center hover:bg-slate-100/50 transition-colors duration-300">
                <div className="w-24 h-24 rounded-full mb-5 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300/50 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-blue-600">{member.role}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
