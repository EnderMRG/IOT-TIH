"use client";

import { Wifi, Cloud, Clock, Signal } from "lucide-react";
import { DeviceStatus } from "@/components/providers/TelemetryProvider";
import { StatusBadge } from "@/components/common/StatusBadge";

interface DeviceStatusCardProps {
  deviceStatus: DeviceStatus | null;
}

function Row({ icon: Icon, label, value, status }: {
  icon: React.ElementType;
  label: string;
  value: string;
  status?: "online" | "offline" | "normal";
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-50/50 rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <div className="text-right">
        {status ? (
          <StatusBadge status={status} size="sm" />
        ) : (
          <p className="text-sm font-semibold text-slate-900">{value}</p>
        )}
      </div>
    </div>
  );
}

export function DeviceStatusCard({ deviceStatus }: DeviceStatusCardProps) {
  if (!deviceStatus) {
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col h-full border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 font-bold text-base">Device Status</h3>
          <StatusBadge status="offline" />
        </div>
        <p className="text-sm text-zinc-400">No device data available.</p>
      </div>
    );
  }

  const lastUploadDate = new Date(deviceStatus.lastUpload);
  const secondsAgo = Math.floor((Date.now() - lastUploadDate.getTime()) / 1000);
  const lastUploadStr = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col h-full border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 font-bold text-base">Device Status</h3>
        <StatusBadge status={deviceStatus.esp32Online ? "online" : "offline"} />
      </div>
      <div className="flex-1 flex flex-col">
        <Row
          icon={Wifi}
          label="ESP32 Connection"
          value=""
          status={deviceStatus.esp32Online ? "online" : "offline"}
        />
        <Row
          icon={Cloud}
          label="ThingSpeak Sync"
          value=""
          status={deviceStatus.thingspeakConnected ? "online" : "offline"}
        />
        <Row
          icon={Clock}
          label="Last Upload"
          value={lastUploadStr}
        />
        <Row
          icon={Signal}
          label="Signal Strength"
          value={`${deviceStatus.rssi} dBm`}
        />
      </div>
    </div>
  );
}
