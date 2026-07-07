import { NextRequest, NextResponse } from "next/server";
import { getHistoryFeeds } from "@/lib/thingspeak";
import type { TelemetryData } from "@/components/providers/TelemetryProvider";

export const revalidate = 60;

type SensorKey = keyof Omit<TelemetryData, "timestamp">;
const KEYS: SensorKey[] = ["temperature", "humidity", "pressure", "altitude", "distance"];

function computeStats(feeds: TelemetryData[], key: SensorKey) {
  const values = feeds.map((f) => f[key] as number).filter((v) => !isNaN(v));
  if (values.length === 0) return { avg: 0, min: 0, max: 0, trend: "stable" as const };

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Trend: compare average of last 10% vs first 10% of the dataset
  const chunk = Math.max(1, Math.floor(values.length * 0.1));
  const firstAvg = values.slice(0, chunk).reduce((a, b) => a + b, 0) / chunk;
  const lastAvg  = values.slice(-chunk).reduce((a, b) => a + b, 0) / chunk;
  const trend = lastAvg > firstAvg + 0.5 ? "up" : lastAvg < firstAvg - 0.5 ? "down" : "stable";

  return { avg: +avg.toFixed(2), min: +min.toFixed(2), max: +max.toFixed(2), trend };
}

function rangeToQuery(range: string) {
  const now = new Date();
  const toTS = (d: Date) => d.toISOString().replace("T", " ").substring(0, 19);

  switch (range) {
    case "1h":  return { results: 240 };
    case "6h":  return { results: 1440 };
    case "24h": return { results: 5760 };
    case "7d":  return { start: toTS(new Date(now.getTime() - 7  * 86400000)), end: toTS(now) };
    case "30d": return { start: toTS(new Date(now.getTime() - 30 * 86400000)), end: toTS(now) };
    default:    return { results: 240 };
  }
}

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "24h";
  const feeds = await getHistoryFeeds(rangeToQuery(range));

  const analytics = Object.fromEntries(
    KEYS.map((key) => [key, computeStats(feeds, key)])
  );

  return NextResponse.json({ range, count: feeds.length, analytics });
}
