import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TelemetryProvider } from "@/components/providers/TelemetryProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "FloodEye — Flood Relief Monitoring",
  description: "Real-time flood monitoring and early warning system powered by ESP32 sensor networks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} font-sans h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col bg-[#f4f3ed] text-[#1c1c1a] overflow-x-hidden w-full">
        <TelemetryProvider>
          {children}
        </TelemetryProvider>
      </body>
    </html>
  );
}
