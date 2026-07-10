"use client";

import { Thermometer, Droplets, Wind, Mountain, Ruler, Loader2, WifiOff, Clock } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { SensorCard } from "@/components/cards/SensorCard";
import { DeviceStatusCard } from "@/components/cards/DeviceStatusCard";
import { ComfortScoreCard } from "@/components/cards/ComfortScoreCard";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { AlertPanel } from "@/components/alerts/AlertPanel";
import { FloodPredictionCard } from "@/components/cards/FloodPredictionCard";
import { FloodAlertBanner } from "@/components/alerts/FloodAlertBanner";
import dynamic from 'next/dynamic';
import { useFloodPrediction } from "@/hooks/useFloodPrediction";
import { useMemo } from "react";

const EcoMap = dynamic(() => import("@/components/Map"), { 
  ssr: false, 
  loading: () => (
    <div className="h-[400px] w-full rounded-[2rem] bg-slate-200/50 animate-pulse border border-slate-100 shadow-sm" />
  )
});

// ── Sub-components ─────────────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <div className="flex flex-col gap-6 animate-pulse px-1">
      {/* Skeleton Row 1: 5 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[140px]" />
        ))}
      </div>

      {/* Skeleton Row 2: Main Chart + Side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] min-h-[360px]" />
        <div className="flex flex-col gap-6">
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[120px]" />
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[200px]" />
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[100px]" />
        </div>
      </div>

      {/* Skeleton Row 3: Alert Panel */}
      <div className="mt-2 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[160px]" />
      
      {/* Skeleton Row 4: Map */}
      <div className="mt-6">
        <div className="h-5 w-32 bg-slate-200/50 rounded mb-4" />
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[1.75rem] h-[400px]" />
      </div>
    </div>
  );
}

function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <WifiOff className="w-12 h-12 text-zinc-300" />
      <p className="text-lg font-bold text-slate-900">Device Offline — No Cached Data</p>
      <p className="text-sm text-slate-500 text-center max-w-sm">
        The ESP32 is not reachable and no previous data exists.
        Once the device comes online, data will be saved automatically.
      </p>
      <p className="text-xs text-zinc-400 text-center max-w-xs mt-1">
        Check that <code className="bg-zinc-100 px-1 py-0.5 rounded">THINGSPEAK_CHANNEL_ID</code> and{" "}
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
  const { prediction, isLoading: isPredictionLoading } = useFloodPrediction(history);

  const chartData = useMemo(() => {
    return history.map((e) => ({
      time:        new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temperature: e.temperature,
      humidity:    e.humidity,
      pressure:    e.pressure,
      altitude:    e.altitude,
      distance:    e.distance,
    }));
  }, [history]);

  const historyTemp = useMemo(() => history.map((h) => h.temperature), [history]);
  const historyHum = useMemo(() => history.map((h) => h.humidity), [history]);
  const historyPress = useMemo(() => history.map((h) => h.pressure), [history]);
  const historyAlt = useMemo(() => history.map((h) => h.altitude), [history]);
  const historyDist = useMemo(() => history.map((h) => h.distance), [history]);

  if (isLoading) return <LoadingOverlay />;
  if (!data)     return <NoDataState />;

  const prev = history[history.length - 2];

  const getTrend = (curr: number, prevVal: number | undefined) =>
    prevVal === undefined ? "stable" : curr > prevVal ? "up" : curr < prevVal ? "down" : "stable";

  const getDelta = (curr: number, prevVal: number | undefined) =>
    prevVal !== undefined ? curr - prevVal : undefined;

  return (
    <div className="flex flex-col gap-6">

      {/* Offline banner — shown when device is unreachable but we have cached data */}
      {isStale && <OfflineBanner lastSeenAt={lastSeenAt} />}
      
      {/* Flood Alert Banner - auto shows on high/critical risk */}
      <FloodAlertBanner />

      {/* Row 1: 5 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <SensorCard
          title={isOffline ? "Temperature (Cached)" : "Temperature"}
          value={data.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          trend={getTrend(data.temperature, prev?.temperature)}
          delta={getDelta(data.temperature, prev?.temperature)}
          status={data.temperature > 35 ? "warning" : "normal"}
          historyData={historyTemp}
        />
        <SensorCard
          title={isOffline ? "Humidity (Cached)" : "Humidity"}
          value={data.humidity.toFixed(0)}
          unit="%"
          icon={Droplets}
          trend={getTrend(data.humidity, prev?.humidity)}
          delta={getDelta(data.humidity, prev?.humidity)}
          status={data.humidity > 80 ? "warning" : "normal"}
          historyData={historyHum}
        />
        <SensorCard
          title="Atmospheric Pressure"
          value={data.pressure.toFixed(0)}
          unit="hPa"
          icon={Wind}
          trend={getTrend(data.pressure, prev?.pressure)}
          delta={getDelta(data.pressure, prev?.pressure)}
          status="normal"
          historyData={historyPress}
          variant="light"
        />
        <SensorCard
          title="Altitude"
          value={data.altitude.toFixed(0)}
          unit="m"
          icon={Mountain}
          trend={getTrend(data.altitude, prev?.altitude)}
          delta={getDelta(data.altitude, prev?.altitude)}
          status="normal"
          historyData={historyAlt}
        />
        <SensorCard
          title={isOffline ? "Water Level (Cached)" : "Water Level"}
          value={data.distance.toFixed(0)}
          unit="cm"
          icon={Ruler}
          trend={getTrend(data.distance, prev?.distance)}
          delta={getDelta(data.distance, prev?.distance)}
          status={data.distance < 20 ? "critical" : data.distance < 40 ? "warning" : "normal"}
          historyData={historyDist}
          variant="primary"
          invertTrend={true}
        />
      </div>

      {/* Row 2: Water Level Chart + Comfort Score + Device Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart — 2 cols */}
        <div className="lg:col-span-2 relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-6 flex flex-col min-h-[360px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-bold text-base">Water Level Trend</h3>
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
            <CustomLineChart data={chartData} dataKey="distance" color="#3b82f6" label="Water Level (cm)" />
          </div>
        </div>

        {/* Right column: Comfort Score, Flood Prediction, Device Status */}
        <div className="flex flex-col gap-6">
          <ComfortScoreCard temperature={data.temperature} humidity={data.humidity} />
          <FloodPredictionCard prediction={prediction} isLoading={isPredictionLoading} />
          {deviceStatus && <DeviceStatusCard deviceStatus={deviceStatus} />}
        </div>
      </div>

      {/* Row 3: Alert Panel */}
      <div className="mt-2">
        <AlertPanel />
      </div>

      {/* Row 4: Map */}
      <div className="mt-6">
        <h3 className="text-slate-900 font-bold text-base mb-4">Device Location</h3>
        <EcoMap 
          distance={data.distance} 
          temperature={data.temperature} 
          humidity={data.humidity} 
        />
      </div>

    </div>
  );
}
