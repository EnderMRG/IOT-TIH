"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Technologies", href: "/technologies" },
  { label: "Gallery", href: "/gallary" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full border border-white/15 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/20">
        <div className="px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Image src="/FloodEye.jpeg" alt="FloodEye" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Flood<span className="text-blue-400">Eye</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-blue-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30">
              Dashboard →
            </Link>
          </div>

          {/* Mobile: Log in + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">
              Log in
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-3xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl md:hidden">
          <div className="flex flex-col px-6 py-5 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium transition-colors py-3 border-b border-white/10 ${
                    isActive ? "text-blue-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/login" onClick={() => setOpen(false)} className="text-center px-5 py-3 text-sm font-bold text-white bg-blue-500 rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30 mt-2">
              Dashboard →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
