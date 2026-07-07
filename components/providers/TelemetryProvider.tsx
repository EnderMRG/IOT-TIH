"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export interface TelemetryData {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  distance: number; // Ultrasonic sensor, cm
  timestamp: string;
}

export interface DeviceStatus {
  esp32Online: boolean;
  thingspeakConnected: boolean;
  lastUpload: string;
  rssi: number; // Not available via ThingSpeak REST — always 0
}

export interface Alert {
  id: string;
  type: "HIGH_TEMPERATURE" | "HIGH_HUMIDITY" | "RAPID_PRESSURE_CHANGE" | "OBJECT_TOO_CLOSE" | "SENSOR_OFFLINE";
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface DashboardSettings {
  refreshInterval: number; // seconds
  tempThreshold: number;   // °C
  humidityThreshold: number; // %
  distanceThreshold: number; // cm (alert when below this)
}

interface TelemetryContextType {
  data: TelemetryData | null;
  history: TelemetryData[];
  alerts: Alert[];
  deviceStatus: DeviceStatus | null;
  settings: DashboardSettings;
  isLoading: boolean;   // true only on very first load when cache is empty
  isOffline: boolean;   // true when the device/ThingSpeak is unreachable
  isStale: boolean;     // true when showing cached data because device is offline
  lastSeenAt: string | null; // ISO timestamp of last successful live reading
  setSettings: (s: DashboardSettings) => void;
  addAlert: (alert: Omit<Alert, "id" | "timestamp">) => void;
  clearAlerts: () => void;
}

// ── localStorage keys ─────────────────────────────────────────────────────────

const LS_DATA    = "ecosense:lastData";
const LS_HISTORY = "ecosense:lastHistory";
const LS_STATUS  = "ecosense:lastStatus";
const LS_SEEN_AT = "ecosense:lastSeenAt";

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or SSR */ }
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultSettings: DashboardSettings = {
  refreshInterval: 15,
  tempThreshold: 35,
  humidityThreshold: 80,
  distanceThreshold: 20,
};

// ── Alert engine ──────────────────────────────────────────────────────────────

function checkAlerts(
  data: TelemetryData,
  prevData: TelemetryData,
  settings: DashboardSettings
): Omit<Alert, "id" | "timestamp"> | null {
  if (data.temperature > settings.tempThreshold) {
    return {
      type: "HIGH_TEMPERATURE",
      severity: data.temperature > settings.tempThreshold + 5 ? "critical" : "warning",
      message: `Temperature is ${data.temperature.toFixed(1)}°C, exceeding threshold of ${settings.tempThreshold}°C.`,
    };
  }
  if (data.humidity > settings.humidityThreshold) {
    return {
      type: "HIGH_HUMIDITY",
      severity: "warning",
      message: `Humidity at ${data.humidity.toFixed(0)}%, above the ${settings.humidityThreshold}% threshold.`,
    };
  }
  const pressureDelta = Math.abs(data.pressure - prevData.pressure);
  if (pressureDelta > 10) {
    return {
      type: "RAPID_PRESSURE_CHANGE",
      severity: "info",
      message: `Pressure changed by ${pressureDelta.toFixed(1)} hPa since last reading. Possible weather change.`,
    };
  }
  if (data.distance < settings.distanceThreshold) {
    return {
      type: "OBJECT_TOO_CLOSE",
      severity: data.distance < 10 ? "critical" : "warning",
      message: `Object detected at ${data.distance.toFixed(1)} cm, below safe threshold of ${settings.distanceThreshold} cm.`,
    };
  }
  return null;
}

// ── Context ───────────────────────────────────────────────────────────────────

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  // All state initialises to null/empty so SSR and first client render match.
  // localStorage is hydrated in useEffect below (client-only).
  const [data, setData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true); // stays true until cache/network resolves
  const [isOffline, setIsOffline] = useState(false);

  // isStale = we have data but it came from cache (offline)
  const isStale = isOffline && data !== null;

  const prevDataRef = useRef<TelemetryData | null>(null);
  const settingsRef = useRef<DashboardSettings>(defaultSettings);
  const offlineAlertFiredRef = useRef(false);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  // ── Hydrate from localStorage (client-only) ─────────────────────────────────
  // This runs once after mount — AFTER the first render — so SSR HTML and the
  // initial client render are identical (both null/empty), preventing the
  // hydration mismatch. The cache is applied in the next paint.
  useEffect(() => {
    const cached = lsGet<TelemetryData>(LS_DATA);
    if (cached) {
      setData(cached);
      prevDataRef.current = cached;
      setIsLoading(false); // cache found — don't show spinner
    }
    const cachedHistory = lsGet<TelemetryData[]>(LS_HISTORY);
    if (cachedHistory) setHistory(cachedHistory);
    const cachedStatus = lsGet<DeviceStatus>(LS_STATUS);
    if (cachedStatus) setDeviceStatus(cachedStatus);
    const cachedSeenAt = lsGet<string>(LS_SEEN_AT);
    if (cachedSeenAt) setLastSeenAt(cachedSeenAt);
    // If nothing was cached, isLoading stays true until the network fetch resolves
    if (!cached) setIsLoading(true);
  }, []);

  const pushAlert = useCallback((alert: Omit<Alert, "id" | "timestamp">) => {
    setAlerts((prev) => [
      { ...alert, id: Math.random().toString(36).substring(7), timestamp: new Date().toISOString() },
      ...prev,
    ].slice(0, 20));
  }, []);

  // ── Initial history load ────────────────────────────────────────────────────
  // Fetch the last 1h from ThingSpeak on first mount to get a richer history
  // than what's in localStorage. If it fails, we fall back to the cached copy.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/history?range=1h")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((feeds: TelemetryData[]) => {
        if (cancelled) return;
        if (feeds.length > 0) {
          const last = feeds[feeds.length - 1];
          setData(last);
          setHistory(feeds);
          setLastSeenAt(last.timestamp);
          setIsOffline(false);
          offlineAlertFiredRef.current = false;
          prevDataRef.current = last;
          // Persist fresh data
          lsSet(LS_DATA, last);
          lsSet(LS_HISTORY, feeds.slice(-240));
          lsSet(LS_SEEN_AT, last.timestamp);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("[TelemetryProvider] initial history fetch failed — using cache:", err);
        // Don't show error — cached data is already in state
        if (!data) {
          // Truly no data at all (first ever load with no cache)
          setIsOffline(true);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Polling loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/sensors");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const { data: newData, deviceStatus: newStatus }: {
          data: TelemetryData;
          deviceStatus: DeviceStatus;
        } = await res.json();

        // ── Success path ──────────────────────────────────────────────────────
        setIsOffline(false);
        offlineAlertFiredRef.current = false;

        setDeviceStatus(newStatus);
        setData(newData);
        setLastSeenAt(newData.timestamp);
        setHistory((prev) => {
          const updated = [...prev, newData].slice(-240);
          lsSet(LS_HISTORY, updated);
          return updated;
        });

        // Persist to localStorage
        lsSet(LS_DATA, newData);
        lsSet(LS_STATUS, newStatus);
        lsSet(LS_SEEN_AT, newData.timestamp);

        // Alert engine
        if (prevDataRef.current) {
          const alert = checkAlerts(newData, prevDataRef.current, settingsRef.current);
          if (alert) pushAlert(alert);
        }
        prevDataRef.current = newData;

      } catch (err) {
        // ── Offline path ──────────────────────────────────────────────────────
        console.warn("[TelemetryProvider] poll failed — device may be offline:", err);
        setIsOffline(true);
        setDeviceStatus((d) => d
          ? { ...d, esp32Online: false, thingspeakConnected: false }
          : null
        );
        // Fire the offline alert only once per outage, not every poll cycle
        if (!offlineAlertFiredRef.current) {
          pushAlert({
            type: "SENSOR_OFFLINE",
            severity: "critical",
            message: "Cannot reach ThingSpeak. Showing last known data. Check your ESP32 connection.",
          });
          offlineAlertFiredRef.current = true;
        }
      }
    };

    // Use a ref to hold the interval so the cleanup function can always reach it,
    // even when the interval is created inside the setTimeout callback.
    const intervalRef = { current: null as ReturnType<typeof setInterval> | null };

    // Small 500ms delay so the initial history fetch (above) gets a head-start
    // before the polling loop kicks off.
    const timeout = setTimeout(() => {
      poll();
      intervalRef.current = setInterval(poll, settings.refreshInterval * 1000);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.refreshInterval, pushAlert]);

  const addAlert = useCallback((alert: Omit<Alert, "id" | "timestamp">) => pushAlert(alert), [pushAlert]);
  const clearAlerts = useCallback(() => setAlerts([]), []);

  return (
    <TelemetryContext.Provider
      value={{
        data,
        history,
        alerts,
        deviceStatus,
        settings,
        isLoading,
        isOffline,
        isStale,
        lastSeenAt,
        setSettings,
        addAlert,
        clearAlerts,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
}
