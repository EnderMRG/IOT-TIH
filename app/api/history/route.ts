import { NextRequest, NextResponse } from "next/server";
import { getHistoryFeeds } from "@/lib/thingspeak";

export const revalidate = 60;

/**
 * Maps a time-range label to a ThingSpeak query strategy.
 *
 * ThingSpeak supports two approaches:
 *   1. `results=N` — the last N entries (fast, no date math needed, good for short windows)
 *   2. `start=...&end=...` — an actual date range (correct for long windows like 7d/30d
 *      where a 8000-entry cap would only reach back ~33 h at 15 s intervals)
 *
 * We use approach 1 for ≤24 h and approach 2 for longer ranges so that "Last 7 Days"
 * actually means the last 7 days, not just the last 8000 entries.
 */
function rangeToQuery(range: string): import("@/lib/thingspeak").HistoryQuery {
  const now = new Date();

  switch (range) {
    case "1h":
      return { results: 240 };   // 240 × 15 s = 1 h
    case "6h":
      return { results: 1440 };  // 1440 × 15 s = 6 h
    case "24h":
      return { results: 5760 };  // 5760 × 15 s = 24 h (ThingSpeak max per call is 8000)
    case "7d": {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: toThingSpeakDate(start), end: toThingSpeakDate(now) };
    }
    case "30d": {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start: toThingSpeakDate(start), end: toThingSpeakDate(now) };
    }
    default:
      return { results: 240 };
  }
}

/** ThingSpeak expects dates as "YYYY-MM-DD HH:MM:SS" in UTC */
function toThingSpeakDate(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19);
}

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "1h";
  const query = rangeToQuery(range);
  const feeds = await getHistoryFeeds(query);

  return NextResponse.json(feeds);
}
