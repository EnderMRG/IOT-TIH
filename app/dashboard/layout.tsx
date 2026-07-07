import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-[#f4f3ed]">
      {/* Sidebar - fixed width on desktop, hidden on mobile */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pr-6 pb-20 md:pb-0">
        <Navbar />
        <div className="flex-1 overflow-auto px-4 md:px-8 pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
