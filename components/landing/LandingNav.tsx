"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";

export function LandingNav() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full border border-white/15 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/20">
      <div className="px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Flood<span className="text-blue-400">Eye</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight * 1.2, behavior: "smooth" })}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight * 2.5, behavior: "smooth" })}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <Link
            href="/about"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            About
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
