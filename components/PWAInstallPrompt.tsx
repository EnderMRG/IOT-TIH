"use client";

import { useState, useEffect } from "react";
import { X, Download, Share, Smartphone } from "lucide-react";

// TypeScript definition for the non-standard beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Assume standalone initially to prevent flash
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                       (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }

    // Check if browser is Chrome or Edge (which support beforeinstallprompt)
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(ua);
    
    if (!isChrome && !isEdge) {
      setIsUnsupported(true);
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chrome support
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-[9999] w-[calc(100%-2rem)] sm:w-full max-w-sm">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-5 relative animate-in slide-in-from-bottom-10 fade-in duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-bold text-slate-900 text-base leading-tight">Install FloodEye</h3>
            
            {isIOS ? (
              <div className="mt-2 text-sm text-slate-600 leading-snug space-y-2">
                <p>Install this app on your iPhone to access it offline.</p>
                <div className="flex flex-col gap-1.5 font-medium text-slate-700 bg-slate-100/70 p-3 rounded-xl border border-slate-200/50">
                  <span className="flex items-center gap-2">
                    1. Tap <Share className="w-4 h-4 text-blue-500" /> Share
                  </span>
                  <span>2. Select "Add to Home Screen"</span>
                </div>
              </div>
            ) : isUnsupported ? (
              <div className="mt-2 text-sm text-slate-600 leading-snug space-y-2">
                <p>Add this dashboard to your home screen for instant offline access.</p>
                <div className="font-medium text-slate-700 bg-slate-100/70 p-3 rounded-xl border border-slate-200/50 text-xs">
                  Please look for an <strong>"Install"</strong> or <strong>"Add to Home Screen"</strong> option in your browser's main menu (⋮).
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-500 leading-snug">
                  Add this dashboard to your home screen for instant offline access and alerts.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
