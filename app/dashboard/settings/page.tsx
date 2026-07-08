"use client";

import { useState } from "react";
import { useTelemetry, DashboardSettings } from "@/components/providers/TelemetryProvider";
import { Save, Wifi, BellRing, Database, RefreshCw, ShieldAlert } from "lucide-react";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-slate-900 font-bold text-base">{title}</h3>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/40 transition";
const darkInputCls = "w-full h-11 bg-white/10 border border-white/20 text-white rounded-xl px-4 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-white/30 transition";

const INTERVALS = [
  { label: "5s",  value: 5 },
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
];

export default function SettingsPage() {
  const { settings, setSettings, isSimulating, setIsSimulating, userRole } = useTelemetry();
  const [local, setLocal] = useState<DashboardSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-slate-500 mt-2 max-w-sm">You are logged in as a resident. Only system administrators can view and modify hardware configurations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure device connection and alert thresholds.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Refresh Interval */}
        <div className="bg-white rounded-[2rem] p-7 shadow-sm">
          <SectionHeader icon={RefreshCw} title="Refresh Interval" />
          <div className="flex gap-3 flex-wrap">
            {INTERVALS.map((iv) => (
              <button
                key={iv.value}
                onClick={() => setLocal({ ...local, refreshInterval: iv.value })}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  local.refreshInterval === iv.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                Every {iv.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Currently refreshing every <strong>{local.refreshInterval}s</strong>. Changes apply after Save.
          </p>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm">
          <SectionHeader icon={BellRing} title="Alert Thresholds" />
          <div className="grid grid-cols-1 gap-4">
            <FieldRow label="Temperature Threshold (°C)">
              <input
                type="number"
                value={local.tempThreshold}
                onChange={(e) => setLocal({ ...local, tempThreshold: Number(e.target.value) })}
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="Humidity Threshold (%)">
              <input
                type="number"
                value={local.humidityThreshold}
                onChange={(e) => setLocal({ ...local, humidityThreshold: Number(e.target.value) })}
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="Water Level Alert Threshold (cm)">
              <input
                type="number"
                value={local.distanceThreshold}
                onChange={(e) => setLocal({ ...local, distanceThreshold: Number(e.target.value) })}
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="Low Pressure Alert Threshold (hPa)">
              <input
                type="number"
                value={local.pressureThreshold}
                onChange={(e) => setLocal({ ...local, pressureThreshold: Number(e.target.value) })}
                className={inputCls}
              />
            </FieldRow>
          </div>
        </div>

        {/* Device Connection */}
        <div className="bg-white rounded-[2rem] p-7 shadow-sm">
          <SectionHeader icon={Wifi} title="Device Connection" />
          <div className="flex flex-col gap-4">
            <FieldRow label="ESP32 IP Address / Hostname">
              <input type="text" defaultValue="192.168.1.142" className={inputCls} />
            </FieldRow>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mt-2">
              <div>
                <p className="font-semibold text-sm text-slate-900">Live Simulation Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Use demo data instead of real hardware</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isSimulating}
                  onChange={(e) => setIsSimulating(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        </div>

        {/* ThingSpeak */}
        <div className="bg-blue-600 rounded-[2rem] p-7 shadow-sm text-white">
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-6">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-white font-bold text-base">ThingSpeak Cloud Sync</h3>
          </div>
          <div className="flex flex-col gap-4">
            <FieldRow label="Channel ID">
              <input type="text" placeholder="e.g. 1234567" className={darkInputCls} />
            </FieldRow>
            <FieldRow label="Read API Key">
              <input type="password" placeholder="••••••••••••" className={darkInputCls} />
            </FieldRow>
          </div>
        </div>

      </div>
    </div>
  );
}
