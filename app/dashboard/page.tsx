"use client";

import { Thermometer, Droplets, Wind, Mountain, Ruler, Loader2, WifiOff, Clock } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { SensorCard } from "@/components/cards/SensorCard";
import { DeviceStatusCard } from "@/components/cards/DeviceStatusCard";
import { ComfortScoreCard } from "@/components/cards/ComfortScoreCard";
import { CircularGauge } from "@/components/gauges/CircularGauge";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { AlertPanel } from "@/components/alerts/AlertPanel";

// ── Sub-components ─────────────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-[#355441] animate-spin" />
      <p className="text-[#78716c] text-sm font-medium">Connecting to ThingSpeak…</p>
    </div>
  );
}

function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <WifiOff className="w-12 h-12 text-zinc-300" />
      <p className="text-lg font-bold text-[#1c1c1a]">Device Offline — No Cached Data</p>
      <p className="text-sm text-[#78716c] text-center max-w-sm">
        The ESP32 is not reachable and no previous data exists.
        Once the device comes online, data will be saved automatically.
      </p>
      <p className="text-xs text-zinc-400 text-center max-w-xs mt-1">
        Also check that <code className="bg-zinc-100 px-1 py-0.5 rounded">THINGSPEAK_CHANNEL_ID</code> and{" "}
        <code className="bg-zinc-100 px-1 py-0.5 rounded">THINGSPEAK_READ_API_KEY</code> are set in{" "}
        <code className="bg-zinc-100 px-1 py-0.5 rounded">.env.local</code>.
      </p>
    </div>
  );
}

function OfflineBanner({ lastSeenAt }: { lastSeenAt: string | null }) {
  const timeAgo = lastSeenAt ? (() => {
    const diff = Math.floor((Date.now() - new Date(lastSeenAt).getTime()) / 1000);
    if (diff < 60)  return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  })() : null;

  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-orange-50 border border-orange-200 rounded-2xl text-orange-800">
      <WifiOff className="w-4 h-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Device Offline — Showing Last Known Data</p>
        {timeAgo && (
          <p className="text-xs text-orange-600 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            Last live reading: {timeAgo}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const { data, history, deviceStatus, isLoading, isOffline, isStale, lastSeenAt } = useTelemetry();

  if (isLoading) return <LoadingOverlay />;
  if (!data)     return <NoDataState />;

  const prev = history[history.length - 2];

  const chartData = history.map((e) => ({
    time:        new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temperature: e.temperature,
    humidity:    e.humidity,
    pressure:    e.pressure,
    altitude:    e.altitude,
    distance:    e.distance,
  }));

  const getTrend = (curr: number, prevVal: number | undefined) =>
    prevVal === undefined ? "stable" : curr > prevVal ? "up" : curr < prevVal ? "down" : "stable";

  const getDelta = (curr: number, prevVal: number | undefined) =>
    prevVal !== undefined ? curr - prevVal : undefined;

  return (
    <div className="flex flex-col gap-6">

      {/* Offline banner — shown when device is unreachable but we have cached data */}
      {isStale && <OfflineBanner lastSeenAt={lastSeenAt} />}

      {/* Row 1: 5 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <SensorCard
          title={isOffline ? "Temperature (Cached)" : "Live Temperature"}
          value={data.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          trend={getTrend(data.temperature, prev?.temperature)}
          delta={getDelta(data.temperature, prev?.temperature)}
          status={data.temperature > 35 ? "warning" : "normal"}
          historyData={history.map((h) => h.temperature)}
          variant="default"
        />
        <SensorCard
          title={isOffline ? "Humidity (Cached)" : "Live Humidity"}
          value={data.humidity.toFixed(0)}
          unit="%"
          icon={Droplets}
          trend={getTrend(data.humidity, prev?.humidity)}
          delta={getDelta(data.humidity, prev?.humidity)}
          status={data.humidity > 80 ? "warning" : "normal"}
          historyData={history.map((h) => h.humidity)}
          variant="default"
        />
        <SensorCard
          title="Atmospheric Pressure"
          value={data.pressure.toFixed(0)}
          unit="hPa"
          icon={Wind}
          trend={getTrend(data.pressure, prev?.pressure)}
          delta={getDelta(data.pressure, prev?.pressure)}
          status="normal"
          historyData={history.map((h) => h.pressure)}
          variant="sand"
        />
        <SensorCard
          title="Altitude"
          value={data.altitude.toFixed(0)}
          unit="m"
          icon={Mountain}
          trend={getTrend(data.altitude, prev?.altitude)}
          delta={getDelta(data.altitude, prev?.altitude)}
          status="normal"
          historyData={history.map((h) => h.altitude)}
          variant="default"
        />
        <SensorCard
          title={isOffline ? "Distance (Cached)" : "Distance"}
          value={data.distance.toFixed(0)}
          unit="cm"
          icon={Ruler}
          trend={getTrend(data.distance, prev?.distance)}
          delta={getDelta(data.distance, prev?.distance)}
          status={data.distance < 20 ? "critical" : data.distance < 40 ? "warning" : "normal"}
          historyData={history.map((h) => h.distance)}
          variant="dark"
          invertTrend={true}
        />
      </div>

      {/* Row 2: Temperature Chart + Comfort Score + Device Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1c1c1a] font-bold text-base">Temperature Trend</h3>
            {isOffline ? (
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <WifiOff className="w-3 h-3" /> Cached
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full animate-pulse">
                ● Live
              </span>
            )}
          </div>
          <div className="flex-1">
            <CustomLineChart data={chartData} dataKey="temperature" color="#e07a5f" label="Temp (°C)" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ComfortScoreCard temperature={data.temperature} humidity={data.humidity} />
          {deviceStatus && <DeviceStatusCard deviceStatus={deviceStatus} />}
        </div>
      </div>

      {/* Row 3: Humidity Gauge + Distance Gauge + Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CircularGauge
          label="Humidity"
          value={data.humidity}
          min={0}
          max={100}
          unit="%"
          color={data.humidity > 80 ? "#f59e0b" : "#355441"}
        />
        <CircularGauge
          label="Distance"
          value={data.distance}
          min={0}
          max={400}
          unit="cm"
          color={data.distance < 20 ? "#ef4444" : data.distance < 40 ? "#f59e0b" : "#3b82f6"}
        />
        <AlertPanel />
      </div>

    </div>
  );
}
