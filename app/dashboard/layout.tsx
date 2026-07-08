import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-50">
      {/* Sidebar - Bottom nav on mobile, left sidebar on desktop */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pr-6 pb-20 md:pb-0">
        <Navbar />
        <div className="flex-1 overflow-auto pb-6 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
