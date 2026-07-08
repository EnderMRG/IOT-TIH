"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { LandingNav } from "@/components/landing/LandingNav";
import { BackgroundSlideshow } from "@/components/landing/BackgroundSlideshow";
import { ScrollytellingSections } from "@/components/landing/ScrollytellingSections";

// Register GSAP plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ force3D: true });
}

/**
 * CanvasSequencePage
 *
 * Responsible for:
 * 1. Initialising Lenis smooth scroll and wiring it to GSAP's RAF loop.
 * 2. Rendering the fixed-position background image slideshow.
 * 3. Rendering the scrollable overlay sections.
 * 4. Rendering the navigation bar.
 */
export function CanvasSequencePage() {
  /* ── Lenis smooth scroll ───────────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis's virtual scroll position
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed nav ──────────────────────────────────────────── */}
      <LandingNav />

      {/* ── Fixed background slideshow ──────────────────────────── */}
      <BackgroundSlideshow />

      {/*
       * ── Scrollable content ─────────────────────────────────────
       * This div is the actual scroll container. Its height drives
       * the scroll progress. The background responds to that progress
       * to crossfade between images.
       */}
      <main className="relative" style={{ zIndex: 10 }}>
        <ScrollytellingSections />
      </main>
    </>
  );
}
