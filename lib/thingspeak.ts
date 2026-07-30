import type { TelemetryData, DeviceStatus } from "@/components/providers/TelemetryProvider";

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

// ── Server-side in-memory cache with request coalescing ───────────────────────
// Prevents cache stampedes: if multiple requests arrive while one ThingSpeak
// fetch is in flight, they all await the same promise instead of firing N
// parallel requests. Cached results are served immediately until TTL expires.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

type LatestResult = { data: TelemetryData; deviceStatus: DeviceStatus };

type GlobalCache = {
  latestCache: Map<string, {
    entry: CacheEntry<LatestResult> | null;
    inflight: Promise<LatestResult | null> | null;
  }>;
  historyCache: Map<string, {
    entry: CacheEntry<TelemetryData[]> | null;
    inflight: Promise<TelemetryData[]> | null;
  }>;
};

const globalAny = globalThis as any;
if (!globalAny.__thingspeakCacheV2) {
  globalAny.__thingspeakCacheV2 = {
    latestCache: new Map(),
    historyCache: new Map()
  };
}
const { latestCache, historyCache } = globalAny.__thingspeakCacheV2 as GlobalCache;

const LATEST_TTL_MS  = 14_000; // 14s — just under the 15s ESP32 upload interval
const HISTORY_TTL_MS = 55_000; // 55s

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the single most-recent sensor reading from ThingSpeak.
 * Returns null if credentials are missing or the request fails.
 *
 * Requests are coalesced: if a fetch is already in-flight, all callers
 * await the same promise. Results are cached for 14s.
 */
export async function getLatestReading(customChannelId?: string, customApiKey?: string): Promise<LatestResult | null> {
  const channelId = customChannelId || process.env.THINGSPEAK_CHANNEL_ID;
  const apiKey = customApiKey || process.env.THINGSPEAK_READ_API_KEY;

  if (!channelId || !apiKey) {
    console.warn("[thingspeak] Missing ThingSpeak credentials");
    return null;
  }

  const cacheKey = channelId;
  if (!latestCache.has(cacheKey)) {
    latestCache.set(cacheKey, { entry: null, inflight: null });
  }
  const slot = latestCache.get(cacheKey)!;

  // Serve from cache if still fresh
  if (slot.entry && Date.now() < slot.entry.expiresAt) {
    return slot.entry.value;
  }

  // If no fetch is in-flight, start one
  if (!slot.inflight) {
    slot.inflight = (async () => {
      try {
        const url = `${BASE_URL}/channels/${channelId}/feeds/last.json?api_key=${apiKey}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`ThingSpeak returned ${res.status}`);

        const feed: ThingSpeakFeed = await res.json();
        const result: LatestResult = {
          data:         feedToTelemetry(feed),
          deviceStatus: deriveDeviceStatus(feed),
        };

        slot.entry = { value: result, expiresAt: Date.now() + LATEST_TTL_MS };
        return result;
      } catch (err) {
        console.error(`[thingspeak] getLatestReading failed for ${channelId}:`, err);
        // Serve stale data on error rather than returning null
        return slot.entry?.value ?? null;
      } finally {
        slot.inflight = null;
      }
    })();
  }

  // Stale-while-revalidate: if we have a stale entry, return it immediately to avoid blocking.
  // Otherwise, await the in-flight request (happens on very first load).
  if (slot.entry) {
    return slot.entry.value;
  }
  return slot.inflight;
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
 *
 * Requests are coalesced per cache key. Results are cached for 55s.
 */
export async function getHistoryFeeds(query: HistoryQuery, customChannelId?: string, customApiKey?: string): Promise<TelemetryData[]> {
  const channelId = customChannelId || process.env.THINGSPEAK_CHANNEL_ID;
  const apiKey = customApiKey || process.env.THINGSPEAK_READ_API_KEY;

  if (!channelId || !apiKey) {
    console.warn("[thingspeak] Missing ThingSpeak credentials");
    return [];
  }

  let params: string;
  if (query.results !== undefined) {
    params = `results=${Math.min(query.results, 8000)}`;
  } else {
    // ThingSpeak expects spaces encoded as %20 (not +) for date params
    params = `start=${encodeURIComponent(query.start)}&end=${encodeURIComponent(query.end)}`;
  }

  const cacheKey = `${channelId}_${params}`;

  // Get or create a cache slot for this query key
  if (!historyCache.has(cacheKey)) {
    historyCache.set(cacheKey, { entry: null, inflight: null });
  }
  const slot = historyCache.get(cacheKey)!;

  // Serve from cache if still fresh
  if (slot.entry && Date.now() < slot.entry.expiresAt) {
    return slot.entry.value;
  }

  // If no fetch is in-flight for this key, start one
  if (!slot.inflight) {
    slot.inflight = (async () => {
      try {
        const url = `${BASE_URL}/channels/${channelId}/feeds.json?api_key=${apiKey}&${params}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`ThingSpeak returned ${res.status}`);

        const body: ThingSpeakResponse = await res.json();
        const feeds = body.feeds.map(feedToTelemetry);

        slot.entry = { value: feeds, expiresAt: Date.now() + HISTORY_TTL_MS };
        return feeds;
      } catch (err) {
        console.error(`[thingspeak] getHistoryFeeds failed for ${channelId}:`, err);
        // Serve stale data on error
        return slot.entry?.value ?? [];
      } finally {
        slot.inflight = null;
      }
    })();
  }

  // Stale-while-revalidate: if we have a stale entry, return it immediately to avoid blocking.
  // Otherwise, await the in-flight request (happens on very first load).
  if (slot.entry) {
    return slot.entry.value;
  }
  return slot.inflight;
}
