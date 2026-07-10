import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { WaveBackground } from "@/components/ui/WaveBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen min-h-[100dvh] bg-transparent relative overscroll-none">
      {/* Animated water wave background */}
      <WaveBackground />

      {/* Sidebar - Bottom nav on mobile, left sidebar on desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pr-6 pb-24 md:pb-0" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
        <Navbar />
        <div className="flex-1 overflow-auto pb-6 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
