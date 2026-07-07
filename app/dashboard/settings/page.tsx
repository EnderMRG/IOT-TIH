"use client";

import { useState } from "react";
import { useTelemetry, DashboardSettings } from "@/components/providers/TelemetryProvider";
import { Save, BellRing, Database, RefreshCw } from "lucide-react";

function SectionHeader({ icon: Icon, title, dark }: { icon: React.ElementType; title: string; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 border-b ${dark ? "border-white/20" : "border-zinc-100"} pb-4 mb-6`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-white/20 text-white" : "bg-[#e1eae2] text-[#355441]"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className={`font-bold text-base ${dark ? "text-white" : "text-[#1c1c1a]"}`}>{title}</h3>
    </div>
  );
}

function FieldRow({ label, dark, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-white/60" : "text-[#78716c]"}`}>{label}</label>
      {children}
    </div>
  );
}

const inputCls     = "w-full h-11 bg-[#f4f3ed] border-none rounded-xl px-4 text-sm text-[#1c1c1a] outline-none focus:ring-2 focus:ring-[#355441]/40 transition";
const darkInputCls = "w-full h-11 bg-white/10 border border-white/20 text-white rounded-xl px-4 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-white/30 transition";

const INTERVALS = [
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
];

export default function SettingsPage() {
  const { settings, setSettings } = useTelemetry();
  const [local, setLocal] = useState<DashboardSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1a]">Settings</h2>
          <p className="text-[#78716c] text-sm mt-1">Configure alert thresholds and refresh behaviour.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#355441] text-white rounded-full text-sm font-semibold hover:bg-[#284032] transition-colors shadow-sm self-start md:self-auto"
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
                    ? "bg-[#355441] text-white shadow-sm"
                    : "bg-[#f4f3ed] text-[#78716c] hover:bg-[#e8e4da]"
                }`}
              >
                Every {iv.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Dashboard polls ThingSpeak every <strong>{local.refreshInterval}s</strong>. Changes apply after Save.
          </p>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-[#fcf7f1] rounded-[2rem] p-7 shadow-sm">
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
            <FieldRow label="Distance Alert Threshold (cm)">
              <input
                type="number"
                value={local.distanceThreshold}
                onChange={(e) => setLocal({ ...local, distanceThreshold: Number(e.target.value) })}
                className={inputCls}
              />
            </FieldRow>
          </div>
        </div>

        {/* ThingSpeak Info */}
        <div className="bg-[#5f7564] rounded-[2rem] p-7 shadow-sm lg:col-span-2">
          <SectionHeader icon={Database} title="ThingSpeak Cloud Sync" dark />
          <p className="text-white/70 text-sm mb-5">
            Connection credentials are configured via environment variables in <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">.env.local</code>.
            The dashboard reads live data directly from your ThingSpeak channel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldRow label="Channel ID" dark>
              <input type="text" readOnly value="Configured in .env.local" className={darkInputCls + " opacity-60 cursor-not-allowed"} />
            </FieldRow>
            <FieldRow label="Read API Key" dark>
              <input type="password" readOnly value="configured-via-env" className={darkInputCls + " opacity-60 cursor-not-allowed"} />
            </FieldRow>
          </div>
        </div>

      </div>
    </div>
  );
}
