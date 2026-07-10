"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, useMemo } from "react";

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

export type AlertType =
  | "HIGH_TEMPERATURE"
  | "HIGH_HUMIDITY"
  | "RAPID_PRESSURE_CHANGE"
  | "HIGH_WATER_LEVEL"
  | "RAPID_WATER_RISE"
  | "OBJECT_TOO_CLOSE"
  | "SENSOR_OFFLINE";

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  /** Whether the user has seen/read this alert (opened the bell) */
  read: boolean;
  /** When this alert was last updated (for dedup refresh) */
  updatedAt: string;
}

export interface DashboardSettings {
  refreshInterval: number;   // seconds
  tempThreshold: number;     // °C
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
  unreadCount: number;
  isSimulating: boolean;
  userRole: "admin" | "user";
  userName: string | null;
  setIsSimulating: (val: boolean) => void;
  setUserRole: (role: "admin" | "user") => void;
  setUserName: (name: string) => void;
  setSettings: (s: DashboardSettings) => void;
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "read" | "updatedAt">) => void;
  clearAlerts: () => void;
  dismissAlert: (id: string) => void;
  markAllRead: () => void;
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

// ── Alert Engine ─────────────────────────────────────────────────────────────
// Returns zero or more distinct alert payloads per evaluation cycle.
// Critically — each alert has a stable `type`, so the provider can
// deduplicate: if an alert of the same type is already active, we only
// refresh its timestamp instead of adding a duplicate.

function evaluateAlerts(
  data: TelemetryData,
  prev: TelemetryData,
  settings: DashboardSettings
): Omit<Alert, "id" | "timestamp" | "read" | "updatedAt">[] {
  const results: Omit<Alert, "id" | "timestamp" | "read" | "updatedAt">[] = [];

  // --- Water Level (highest priority) ---
  const waterRise = prev.distance - data.distance; // positive = water rose
  if (waterRise >= 5) {
    results.push({
      type: "RAPID_WATER_RISE",
      severity: "critical",
      message: `Water rising rapidly — ${waterRise.toFixed(1)} cm increase detected. Immediate action may be required.`,
    });
  } else if (data.distance < settings.distanceThreshold) {
    const isCritical = data.distance < settings.distanceThreshold * 0.6;
    results.push({
      type: "HIGH_WATER_LEVEL",
      severity: isCritical ? "critical" : "warning",
      message: isCritical
        ? `Critical flood level: Water sensor reading ${data.distance.toFixed(0)} cm — dangerously high.`
        : `Elevated water level: ${data.distance.toFixed(0)} cm (threshold: ${settings.distanceThreshold} cm).`,
    });
  }

  // --- Pressure (storm indicator) ---
  if (data.pressure < settings.pressureThreshold) {
    const isExtreme = data.pressure < 995;
    // Only fire if significant drop from previous (>2 hPa) to avoid constant low-pressure alerts
    const pressureDrop = prev.pressure - data.pressure;
    if (pressureDrop > 2 || data.pressure < 998) {
      results.push({
        type: "RAPID_PRESSURE_CHANGE",
        severity: isExtreme ? "critical" : "warning",
        message: isExtreme
          ? `Extreme pressure drop to ${data.pressure.toFixed(1)} hPa — severe storm conditions possible.`
          : `Pressure dropping (${data.pressure.toFixed(1)} hPa, −${pressureDrop.toFixed(1)} hPa). Storm activity likely.`,
      });
    }
  }

  // --- Temperature ---
  if (data.temperature > settings.tempThreshold) {
    const isCritical = data.temperature > settings.tempThreshold + 5;
    // Only alert if notably above threshold (>1°C margin to avoid constant borderline alerts)
    if (data.temperature > settings.tempThreshold + 1) {
      results.push({
        type: "HIGH_TEMPERATURE",
        severity: isCritical ? "critical" : "warning",
        message: `Temperature at ${data.temperature.toFixed(1)}°C exceeds threshold (${settings.tempThreshold}°C).`,
      });
    }
  }

  // --- Humidity ---
  if (data.humidity > settings.humidityThreshold) {
    const isCritical = data.humidity > 95;
    if (data.humidity > settings.humidityThreshold + 2) {
      results.push({
        type: "HIGH_HUMIDITY",
        severity: isCritical ? "critical" : "warning",
        message: `Humidity at ${data.humidity.toFixed(0)}% — above threshold (${settings.humidityThreshold}%). Risk of mold and equipment damage.`,
      });
    }
  }

  return results;
}

// ── Per-type cooldown config (ms) ─────────────────────────────────────────────
// Prevents the same alert type from spamming when condition persists.
// A new alert of the same type is only added/refreshed after this window.
const ALERT_COOLDOWN: Record<AlertType, number> = {
  HIGH_TEMPERATURE:      5 * 60 * 1000,  // 5 min
  HIGH_HUMIDITY:         5 * 60 * 1000,  // 5 min
  RAPID_PRESSURE_CHANGE: 3 * 60 * 1000,  // 3 min
  HIGH_WATER_LEVEL:      2 * 60 * 1000,  // 2 min
  RAPID_WATER_RISE:      1 * 60 * 1000,  // 1 min (most urgent)
  OBJECT_TOO_CLOSE:      2 * 60 * 1000,  // 2 min
  SENSOR_OFFLINE:       10 * 60 * 1000,  // 10 min (fires once)
};

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

import { useNativeNotification } from "@/hooks/useNativeNotification";

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  // ── Core state ─────────────────────────────────────────────────────────────
  const [data, setData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // ── Native Notifications ───────────────────────────────────────────────────
  const { sendNotification } = useNativeNotification();

  // ── Simulation / role state ────────────────────────────────────────────────
  const [isSimulating, setIsSimulatingState] = useState(false);
  const [userRole, setUserRoleState] = useState<"admin" | "user">("admin");
  const [userName, setUserNameState] = useState<string | null>(null);

  const isStale = isOffline && data !== null;

  const prevDataRef = useRef<TelemetryData | null>(null);
  const settingsRef = useRef<DashboardSettings>(defaultSettings);
  const offlineAlertFiredRef = useRef(false);

  // Track last-fired timestamp per alert type for cooldown enforcement
  const lastAlertTimeRef = useRef<Partial<Record<AlertType, number>>>({});

  useEffect(() => { settingsRef.current = settings; }, [settings]);

  // ── Computed: unread count ─────────────────────────────────────────────────
  const unreadCount = alerts.filter((a) => !a.read).length;

  // ── Hydrate role from localStorage ────────────────────────────────────────
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("floodeye_session");
      if (savedRole === "admin" || savedRole === "user") setUserRoleState(savedRole);
      const savedName = localStorage.getItem("floodeye_user_name");
      if (savedName) setUserNameState(savedName);
    } catch { /* private mode */ }
  }, []);

  const setUserRole = (role: "admin" | "user") => {
    localStorage.setItem("floodeye_session", role);
    setUserRoleState(role);
  };

  const setUserName = (name: string) => {
    localStorage.setItem("floodeye_user_name", name);
    setUserNameState(name);
  };

  const setIsSimulating = (val: boolean) => setIsSimulatingState(val);

  // ── Alert helpers ──────────────────────────────────────────────────────────

  /**
   * Smart push: deduplicates by type + respects cooldown.
   * If same type already active and within cooldown window → skip.
   * If same type exists but cooldown expired → update message/timestamp.
   */
  const pushAlert = useCallback((incoming: Omit<Alert, "id" | "timestamp" | "read" | "updatedAt">) => {
    const now = Date.now();
    const cooldown = ALERT_COOLDOWN[incoming.type] ?? 2 * 60 * 1000;
    const lastFired = lastAlertTimeRef.current[incoming.type] ?? 0;

    if (now - lastFired < cooldown) return; // still in cooldown — skip silently

    lastAlertTimeRef.current[incoming.type] = now;
    const nowIso = new Date().toISOString();

    // Trigger native OS notification for new critical/warning alerts
    if (incoming.severity === "critical" || incoming.severity === "warning") {
      const title = incoming.severity === "critical" ? "⚠️ CRITICAL FLOOD ALERT" : "⚠️ FloodEye Warning";
      sendNotification(title, {
        body: incoming.message,
        tag: incoming.type, // Prevents stacking same alert type
      });
    }

    setAlerts((prev) => {
      const existing = prev.find((a) => a.type === incoming.type);
      if (existing) {
        // Refresh message and timestamp; keep read state (user may not have seen it yet)
        return prev.map((a) =>
          a.type === incoming.type
            ? { ...a, message: incoming.message, severity: incoming.severity, updatedAt: nowIso, read: false }
            : a
        );
      }
      const newAlert: Alert = {
        ...incoming,
        id: Math.random().toString(36).slice(2, 9),
        timestamp: nowIso,
        updatedAt: nowIso,
        read: false,
      };
      return [newAlert, ...prev].slice(0, 20);
    });
  }, []);

  /** External addAlert (for use in hooks/other components) — also respects dedup */
  const addAlert = useCallback(
    (alert: Omit<Alert, "id" | "timestamp" | "read" | "updatedAt">) => pushAlert(alert),
    [pushAlert]
  );

  /** Remove a single alert */
  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /** Clear entire log */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    lastAlertTimeRef.current = {}; // reset cooldowns so they fire fresh next time
  }, []);

  /** Mark all unread alerts as read (called when notification panel opens) */
  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  // ── Hydrate from localStorage (client-only) ────────────────────────────────
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

  // ── SIMULATION MODE LOOP ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isSimulating) return;

    if (history.length === 0) {
      const initialHistory = buildInitialSimHistory();
      setHistory(initialHistory);
    }

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

        // Run alert evaluation in simulation too — but cooldowns keep it sane
        if (prevDataRef.current) {
          const triggered = evaluateAlerts(newData, prevDataRef.current, settingsRef.current);
          triggered.forEach((a) => pushAlert(a));
        }
        prevDataRef.current = newData;

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
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
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
        if (!data) setIsOffline(true);
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
          const triggered = evaluateAlerts(newData, prevDataRef.current, settingsRef.current);
          triggered.forEach((a) => pushAlert(a));
        }
        prevDataRef.current = newData;

      } catch (err) {
        console.warn("[TelemetryProvider] poll failed — device may be offline:", err);
        setIsOffline(true);
        setDeviceStatus((d) => d ? { ...d, esp32Online: false, thingspeakConnected: false } : null);
        if (!offlineAlertFiredRef.current) {
          pushAlert({
            type: "SENSOR_OFFLINE",
            severity: "warning",
            message: "Cannot reach the sensor device. Dashboard is showing last cached data.",
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

  const contextValue = useMemo(() => ({
    data,
    history,
    alerts,
    deviceStatus,
    settings,
    isLoading,
    isOffline,
    isStale,
    lastSeenAt,
    unreadCount,
    isSimulating,
    userRole,
    userName,
    setIsSimulating,
    setUserRole,
    setUserName,
    setSettings,
    addAlert,
    clearAlerts,
    dismissAlert,
    markAllRead,
  }), [
    data, history, alerts, deviceStatus, settings, isLoading, isOffline, isStale, lastSeenAt, unreadCount, isSimulating, userRole, userName,
    setIsSimulating, setUserRole, setUserName, setSettings, addAlert, clearAlerts, dismissAlert, markAllRead
  ]);

  return (
    <TelemetryContext.Provider value={contextValue}>
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
