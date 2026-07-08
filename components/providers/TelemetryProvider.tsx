"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

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
  rssi: number;
}

export interface Alert {
  id: string;
  type:
    | "HIGH_TEMPERATURE"
    | "HIGH_HUMIDITY"
    | "RAPID_PRESSURE_CHANGE"
    | "HIGH_WATER_LEVEL"
    | "RAPID_WATER_RISE"
    | "OBJECT_TOO_CLOSE"
    | "SENSOR_OFFLINE";
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface DashboardSettings {
  refreshInterval: number;  // seconds
  tempThreshold: number;    // °C
  humidityThreshold: number; // %
  distanceThreshold: number; // cm (alert when below this)
  pressureThreshold: number; // hPa (alert when below this)
}

interface TelemetryContextType {
  data: TelemetryData | null;
  history: TelemetryData[];
  alerts: Alert[];
  deviceStatus: DeviceStatus | null;
  settings: DashboardSettings;
  isLoading: boolean;
  isOffline: boolean;
  isStale: boolean;
  lastSeenAt: string | null;
  // Simulation / role (Project B additions)
  isSimulating: boolean;
  userRole: "admin" | "user";
  setIsSimulating: (val: boolean) => void;
  setUserRole: (role: "admin" | "user") => void;
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
  pressureThreshold: 1005,
};

const defaultSimData: TelemetryData = {
  temperature: 24.5,
  humidity: 55,
  pressure: 1013.25,
  altitude: 120,
  distance: 85,
  timestamp: new Date().toISOString(),
};

const defaultSimDeviceStatus: DeviceStatus = {
  esp32Online: true,
  thingspeakConnected: true,
  lastUpload: new Date().toISOString(),
  rssi: -52,
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
      severity: data.humidity > 95 ? "critical" : "warning",
      message: `Humidity at ${data.humidity.toFixed(0)}%, above the ${settings.humidityThreshold}% threshold.`,
    };
  }
  if (data.pressure < settings.pressureThreshold) {
    return {
      type: "RAPID_PRESSURE_CHANGE",
      severity: data.pressure < 995 ? "critical" : "warning",
      message: data.pressure < 995
        ? `Severe storm alert: Extreme pressure drop! (${data.pressure.toFixed(1)} hPa)`
        : `Low pressure system: Storm approaching. (${data.pressure.toFixed(1)} hPa)`,
    };
  }
  // Rapid water rise
  const waterRise = prevData.distance - data.distance;
  if (waterRise > 4) {
    return {
      type: "RAPID_WATER_RISE",
      severity: "critical",
      message: `Emergency: Water level rising rapidly! (Rose by ${waterRise.toFixed(1)} cm).`,
    };
  }
  if (data.distance < settings.distanceThreshold) {
    return {
      type: "HIGH_WATER_LEVEL",
      severity: data.distance < 30 ? "critical" : "warning",
      message: data.distance < 30
        ? `CRITICAL FLOOD RISK: Water level is breaching! (${data.distance.toFixed(1)} cm from sensor)`
        : `Flood Warning: Water level rising. (${data.distance.toFixed(1)} cm from sensor)`,
    };
  }
  return null;
}

// ── Simulation helpers ────────────────────────────────────────────────────────

function buildInitialSimHistory(): TelemetryData[] {
  return Array.from({ length: 24 }).map((_, i) => ({
    temperature: 22 + Math.sin(i * 0.4) * 4 + Math.random() * 1.5,
    humidity: 50 + Math.cos(i * 0.3) * 12 + Math.random() * 3,
    pressure: 1013 + Math.sin(i * 0.2) * 3 + Math.random() * 1,
    altitude: 118 + Math.cos(i * 0.5) * 4 + Math.random() * 2,
    distance: 75 + Math.sin(i * 0.6) * 20 + Math.random() * 5,
    timestamp: new Date(Date.now() - (24 - i) * 15000).toISOString(),
  }));
}

// ── Context ───────────────────────────────────────────────────────────────────

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  // ── Core state ────────────────────────────────────────────────────────────
  const [data, setData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // ── Simulation / role state (Project B) ──────────────────────────────────
  const [isSimulating, setIsSimulatingState] = useState(false);
  const [userRole, setUserRoleState] = useState<"admin" | "user">("admin");

  const isStale = isOffline && data !== null;

  const prevDataRef = useRef<TelemetryData | null>(null);
  const settingsRef = useRef<DashboardSettings>(defaultSettings);
  const offlineAlertFiredRef = useRef(false);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  // ── Hydrate role from localStorage ───────────────────────────────────────
  useEffect(() => {
    const savedRole = localStorage.getItem("floodeye_session");
    if (savedRole === "admin" || savedRole === "user") {
      setUserRoleState(savedRole);
    }
  }, []);

  const setUserRole = (role: "admin" | "user") => {
    localStorage.setItem("floodeye_session", role);
    setUserRoleState(role);
  };

  const setIsSimulating = (val: boolean) => {
    setIsSimulatingState(val);
  };

  // ── Alert helpers ────────────────────────────────────────────────────────
  const pushAlert = useCallback((alert: Omit<Alert, "id" | "timestamp">) => {
    setAlerts((prev) => [
      { ...alert, id: Math.random().toString(36).substring(7), timestamp: new Date().toISOString() },
      ...prev,
    ].slice(0, 20));
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, "id" | "timestamp">) => pushAlert(alert), [pushAlert]);
  const clearAlerts = useCallback(() => setAlerts([]), []);

  // ── Hydrate from localStorage (client-only) ───────────────────────────────
  useEffect(() => {
    const cached = lsGet<TelemetryData>(LS_DATA);
    if (cached) {
      setData(cached);
      prevDataRef.current = cached;
      setIsLoading(false);
    }
    const cachedHistory = lsGet<TelemetryData[]>(LS_HISTORY);
    if (cachedHistory) setHistory(cachedHistory);
    const cachedStatus = lsGet<DeviceStatus>(LS_STATUS);
    if (cachedStatus) setDeviceStatus(cachedStatus);
    const cachedSeenAt = lsGet<string>(LS_SEEN_AT);
    if (cachedSeenAt) setLastSeenAt(cachedSeenAt);
    if (!cached) setIsLoading(true);
  }, []);

  // ── SIMULATION MODE LOOP ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isSimulating) return;

    // Seed initial history if empty
    if (history.length === 0) {
      const initialHistory = buildInitialSimHistory();
      setHistory(initialHistory);
    }

    // Set default sim data if no data yet
    if (!data) {
      setData(defaultSimData);
      setDeviceStatus(defaultSimDeviceStatus);
      setIsLoading(false);
      setIsOffline(false);
    }

    const interval = setInterval(() => {
      setData((prev) => {
        const base = prev ?? defaultSimData;
        const newData: TelemetryData = {
          temperature: Number((base.temperature + (Math.random() * 0.6 - 0.3)).toFixed(1)),
          humidity: Math.max(0, Math.min(100, base.humidity + (Math.random() * 2 - 1))),
          pressure: Number((base.pressure + (Math.random() * 4 - 2)).toFixed(2)),
          altitude: Number((base.altitude + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          distance: Math.max(2, Math.min(400, base.distance + (Math.random() * 10 - 5))),
          timestamp: new Date().toISOString(),
        };

        setHistory((prevHistory) => {
          const updated = [...prevHistory, newData];
          if (updated.length > 60) updated.shift();
          return updated;
        });

        setDeviceStatus((d) => ({
          ...(d ?? defaultSimDeviceStatus),
          lastUpload: new Date().toISOString(),
          rssi: (d?.rssi ?? -52) + Math.floor(Math.random() * 3 - 1),
        }));

        return newData;
      });
    }, settingsRef.current.refreshInterval * 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating]);

  // ── REAL MODE: Initial history load from ThingSpeak ───────────────────────
  useEffect(() => {
    if (isSimulating) return;

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
          lsSet(LS_DATA, last);
          lsSet(LS_HISTORY, feeds.slice(-240));
          lsSet(LS_SEEN_AT, last.timestamp);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("[TelemetryProvider] initial history fetch failed — using cache:", err);
        if (!data) {
          setIsOffline(true);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating]);

  // ── REAL MODE: Polling loop ───────────────────────────────────────────────
  useEffect(() => {
    if (isSimulating) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/sensors");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const { data: newData, deviceStatus: newStatus }: {
          data: TelemetryData;
          deviceStatus: DeviceStatus;
        } = await res.json();

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

        lsSet(LS_DATA, newData);
        lsSet(LS_STATUS, newStatus);
        lsSet(LS_SEEN_AT, newData.timestamp);

        if (prevDataRef.current) {
          const alert = checkAlerts(newData, prevDataRef.current, settingsRef.current);
          if (alert) pushAlert(alert);
        }
        prevDataRef.current = newData;

      } catch (err) {
        console.warn("[TelemetryProvider] poll failed — device may be offline:", err);
        setIsOffline(true);
        setDeviceStatus((d) => d
          ? { ...d, esp32Online: false, thingspeakConnected: false }
          : null
        );
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

    const intervalRef = { current: null as ReturnType<typeof setInterval> | null };

    const timeout = setTimeout(() => {
      poll();
      intervalRef.current = setInterval(poll, settings.refreshInterval * 1000);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating, settings.refreshInterval, pushAlert]);

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
        isSimulating,
        userRole,
        setIsSimulating,
        setUserRole,
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
