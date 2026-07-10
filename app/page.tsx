import { CanvasSequencePage } from "@/components/landing/CanvasSequencePage";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export const metadata = {
  title: "FloodEye — Flood Relief Monitoring",
  description: "Delivering precise, real-time flood monitoring and instant early warnings — keeping communities safe when it matters most.",
};

export default function Home() {
  return (
    <>
      <CanvasSequencePage />
      <PWAInstallPrompt />
    </>
  );
}
