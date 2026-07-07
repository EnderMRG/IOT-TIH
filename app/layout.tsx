import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { TelemetryProvider } from "@/components/providers/TelemetryProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IoT Environmental Dashboard",
  description: "Live sensor telemetry and historical analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} font-sans h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-[#f4f3ed] text-[#1c1c1a]`}>
        <TelemetryProvider>
          {children}
        </TelemetryProvider>
      </body>
    </html>
  );
}
