"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import img1 from "@/assests/landpage/india-weather-floods.jpg";
import img2 from "@/assests/landpage/guwahati-flood.jpg";
import img3 from "@/assests/landpage/1045183-assam-floods-1x.png";

const IMAGES = [img1, img2, img3];

/**
 * BackgroundSlideshow
 *
 * A fixed, full-viewport background that smoothly crossfades between the 3
 * landpage images as the user scrolls through the page.
 *
 * Scroll mapping:
 *   0%   – 33%  → image 1 fully visible
 *   33%  – 50%  → crossfade from image 1 → image 2
 *   50%  – 66%  → image 2 fully visible
 *   66%  – 83%  → crossfade from image 2 → image 3
 *   83%  – 100% → image 3 fully visible
 */
export function BackgroundSlideshow() {
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? scrollTop / maxScroll : 0; // 0 → 1

      /**
       * Transition band centres:
       *   img1 → img2  at p = 0.40
       *   img2 → img3  at p = 0.75
       *
       * Each band is ±0.10 wide (20% of total scroll).
       */
      const BAND = 0.10;
      const T1 = 0.40; // start of img1→img2 fade
      const T2 = 0.75; // start of img2→img3 fade

      // opacity of each layer
      let o1: number, o2: number, o3: number;

      if (p < T1 - BAND) {
        // fully on image 1
        o1 = 1; o2 = 0; o3 = 0;
      } else if (p < T1 + BAND) {
        // crossfade 1→2
        const t = (p - (T1 - BAND)) / (2 * BAND); // 0→1
        o1 = 1 - t; o2 = t; o3 = 0;
      } else if (p < T2 - BAND) {
        // fully on image 2
        o1 = 0; o2 = 1; o3 = 0;
      } else if (p < T2 + BAND) {
        // crossfade 2→3
        const t = (p - (T2 - BAND)) / (2 * BAND);
        o1 = 0; o2 = 1 - t; o3 = t;
      } else {
        // fully on image 3
        o1 = 0; o2 = 0; o3 = 1;
      }

      const opacities = [o1, o2, o3];
      refs.forEach((ref, i) => {
        if (ref.current) {
          ref.current.style.opacity = String(opacities[i]);
        }
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
      aria-hidden="true"
    >
      {IMAGES.map((src, i) => (
        <div
          key={i}
          ref={refs[i]}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === 0 ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            willChange: "opacity",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            quality={85}
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
        </div>
      ))}
    </div>
  );
}
