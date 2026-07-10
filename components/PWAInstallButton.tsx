"use client";

import { useState, useEffect } from "react";
import { Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                       (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert("To install on iOS: Tap the Share button at the bottom of Safari, then select 'Add to Home Screen'.");
      return;
    }

    if (!deferredPrompt) {
      alert("Automatic installation is not supported by your current browser (e.g., Firefox, Safari). Please look for an 'Install' or 'Add to Home Screen' option in your browser's main menu.");
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;

  return (
    <button
      onClick={handleInstallClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-95 ${className}`}
      title={isIOS ? "Install on iOS via Share" : "Install App"}
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
}
