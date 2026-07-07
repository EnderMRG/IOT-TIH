import type { TelemetryData, DeviceStatus } from "@/components/providers/TelemetryProvider";

const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const API_KEY = process.env.THINGSPEAK_READ_API_KEY;
const BASE_URL = "https://api.thingspeak.com";

// ── Types from ThingSpeak REST API ────────────────────────────────────────────

interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string | null; // temperature
  field2: string | null; // humidity
  field3: string | null; // pressure
  field4: string | null; // altitude
  field5: string | null; // distance
}

interface ThingSpeakResponse {
  channel: {
    id: number;
    last_entry_id: number;
    updated_at: string;
  };
  feeds: ThingSpeakFeed[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseField(value: string | null, fallback = 0): number {
  const parsed = parseFloat(value ?? "");
  return isNaN(parsed) ? fallback : parsed;
}

function feedToTelemetry(feed: ThingSpeakFeed): TelemetryData {
  return {
    temperature: parseField(feed.field1),
    humidity:    parseField(feed.field2),
    pressure:    parseField(feed.field3, 1013.25),
    altitude:    parseField(feed.field4),
    distance:    parseField(feed.field5),
    timestamp:   feed.created_at,
  };
}

function deriveDeviceStatus(feed: ThingSpeakFeed): DeviceStatus {
  const lastUpload = feed.created_at;
  const secondsSinceUpload = (Date.now() - new Date(lastUpload).getTime()) / 1000;
  return {
    esp32Online:          secondsSinceUpload < 60,
    thingspeakConnected:  true,
    lastUpload,
    rssi:                 0, // Not available via ThingSpeak REST
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the single most-recent sensor reading from ThingSpeak.
 * Returns null if credentials are missing or the request fails.
 */
export async function getLatestReading(): Promise<{
  data: TelemetryData;
  deviceStatus: DeviceStatus;
} | null> {
  if (!CHANNEL_ID || !API_KEY) {
    console.warn("[thingspeak] Missing THINGSPEAK_CHANNEL_ID or THINGSPEAK_READ_API_KEY");
    return null;
  }

  try {
    const url = `${BASE_URL}/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error(`ThingSpeak returned ${res.status}`);

    const feed: ThingSpeakFeed = await res.json();
    return {
      data:         feedToTelemetry(feed),
      deviceStatus: deriveDeviceStatus(feed),
    };
  } catch (err) {
    console.error("[thingspeak] getLatestReading failed:", err);
    return null;
  }
}

export type HistoryQuery =
  | { results: number; start?: undefined; end?: undefined }
  | { start: string; end: string; results?: undefined };

/**
 * Fetch historical feeds from ThingSpeak.
 *
 * @param query - Either `{ results: N }` for the last N entries,
 *                or `{ start, end }` for an explicit date range
 *                (format: "YYYY-MM-DD HH:MM:SS" UTC).
 */
export async function getHistoryFeeds(query: HistoryQuery): Promise<TelemetryData[]> {
  if (!CHANNEL_ID || !API_KEY) {
    console.warn("[thingspeak] Missing THINGSPEAK_CHANNEL_ID or THINGSPEAK_READ_API_KEY");
    return [];
  }

  let params: string;
  if (query.results !== undefined) {
    params = `results=${Math.min(query.results, 8000)}`;
  } else {
    // ThingSpeak expects spaces encoded as %20 (not +) for date params
    params = `start=${encodeURIComponent(query.start)}&end=${encodeURIComponent(query.end)}`;
  }

  try {
    const url = `${BASE_URL}/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&${params}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`ThingSpeak returned ${res.status}`);

    const body: ThingSpeakResponse = await res.json();
    return body.feeds.map(feedToTelemetry);
  } catch (err) {
    console.error("[thingspeak] getHistoryFeeds failed:", err);
    return [];
  }
}
