"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { Users } from "lucide-react";
import Image from "next/image";
import bgImage from "@/assests/about page/flood-main-1782292399476_d.webp";
import { ExpandableTeamCards } from "@/components/about/ExpandableTeamCards";

/* ── Glass card ────────────────────────────────────────────────── */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/15 bg-black/30 backdrop-blur-xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  const team = [
    {
      name: "Ashish Kumar Mahato",
      image: "/ashihs.jpg",
      // ✏️ EDIT: Update this bio and skills for Ashish
      bio: "Ashish Kumar Mahato serves as the project mentor, guiding the team through the development of FloodEye. His expertise in IoT systems and embedded programming has been instrumental in shaping the architecture of the platform.",
      skills: [],
    },
    {
      name: "Aryyaman Bora",
      role: "Frontend and UI Design",
      image: "/aryyaman.jpeg",
      // ✏️ EDIT: Update this bio and skills for Aryyaman
      bio: "Aryyaman Bora is responsible for the frontend development and UI design of FloodEye. He crafted the landing page, the dashboard layout, and the visual identity of the platform using Next.js and Tailwind CSS.",
      skills: ["Next.js", "Tailwind CSS", "UI/UX Design", "Framer Motion"],
    },
    {
      name: "Moharnab Gogoi",
      role: "Backend and IoT",
      image: "/moharnab.jpeg",
      // ✏️ EDIT: Update this bio and skills for Moharnab
      bio: "Moharnab Gogoi handles the backend infrastructure and IoT integration for FloodEye. He built the data pipelines, ThingSpeak API integration, and the real-time telemetry system that powers the dashboard.",
      skills: ["ESP32", "ThingSpeak API", "Next.js API Routes", "IoT Sensors"],
    },
    {
      name: "Mayuree Khanikar",
      role: "Research and Documentation",
      image: "/mayuree.jpeg",
      // ✏️ EDIT: Update this bio and skills for Mayuree
      bio: "Mayuree Khanikar leads the research and documentation efforts for FloodEye. She is responsible for gathering domain knowledge on flood monitoring systems and compiling comprehensive project reports.",
      skills: ["Technical Writing", "Research", "Data Analysis", "Documentation"],
    },
    {
      name: "Indrani Gogoi",
      role: "Research and Documentation",
      image: "/indrani.jpeg",
      // ✏️ EDIT: Update this bio and skills for Indrani
      bio: "Indrani Gogoi contributes to the research and documentation of FloodEye, focusing on the societal impact of flood early warning systems and the technical review of sensor data accuracy.",
      skills: ["Research", "Documentation", "Data Review", "Impact Analysis"],
    },
  ];

  // const mentors = [
  //   { name: "Dr. Pratiksha Sharma", role: "Co-ordinator" },
  // ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <LandingNav />

      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt="Flood Background"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 pointer-events-none" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* About TIH Section */}
        <section className="mb-24">
          <h2 className="font-sans text-4xl font-bold text-white mb-8">About</h2>

          <GlassCard className="p-8 md:p-10">
            {/* Header: Title on left, Logo on right */}
            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/20 mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">IoT Based Flood Monitoring System</h3>
                <p className="text-blue-400 font-medium text-lg">TIH | IIT Guwahati</p>
              </div>
              <div className="shrink-0 flex justify-start md:justify-end">
                <Image src="/logotih.png" alt="TIH" width={160} height={160} className="object-contain drop-shadow-md" />
              </div>
            </div>

            {/* Content taking full width below */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Our Vision</h3>
                <p className="text-white/90 leading-relaxed text-base md:text-lg drop-shadow-sm">
                  To leverage advanced IoT technologies, sensor networks and real-time data analytics for accurate flood and water level monitoring, enabling timely early warnings to protect lives, property and the environment.<br /><br />
                  <strong className="text-white">&quot;Building a safer society and a flood-resilient future through smart technology.&quot;</strong><br />
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Missions</h3>
                <p className="text-white/90 leading-relaxed text-base md:text-lg drop-shadow-sm">
                  <strong className="text-white">•</strong>	 Monitor water levels in real time using IoT-enabled sensors. <br />
                  <strong className="text-white">•</strong>	 Provide timely and reliable flood early warning alerts.  <br />
                  <strong className="text-white">•</strong>  Deliver accurate and trustworthy data to government agencies and citizens.  <br />
                  <strong className="text-white">•</strong>  Reduce disaster risks and improve community preparedness.  <br />
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
        {/* About the Project Section */}
        <section className="mb-24">
          <h1 className="font-sans text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-8">
            About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Project</span>
          </h1>

          <GlassCard className="p-8 md:p-10">
            <p className="text-lg md:text-xl text-white leading-relaxed font-medium mb-6 drop-shadow-sm">
              We have done this project under TIH IIT Guwahati under the mentorship of Sir Ashish Kumar Mahato and Co-ordinator Dr. Pratiksha Sharma.
            </p>
            <div className="space-y-4 text-white/90 leading-relaxed text-base md:text-lg drop-shadow-sm">
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
            <div className="w-12 h-12 rounded-2xl border border-blue-400/30 bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="font-sans text-4xl font-bold text-white">Team Details</h2>
          </div>

          <ExpandableTeamCards members={team} />
        </section>
      </main>
    </div >
  );
}
