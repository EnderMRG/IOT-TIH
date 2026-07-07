"use client";

import { useState, useEffect } from "react";
import { Wifi, Cloud, Clock, Signal } from "lucide-react";
import { DeviceStatus } from "@/components/providers/TelemetryProvider";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";

interface DeviceStatusCardProps {
  deviceStatus: DeviceStatus;
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
        <div className="w-8 h-8 bg-[#f4f3ed] rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#355441]" />
        </div>
        <p className="text-sm font-medium text-[#78716c]">{label}</p>
      </div>
      <div className="text-right">
        {status ? (
          <StatusBadge status={status} size="sm" />
        ) : (
          <p className="text-sm font-semibold text-[#1c1c1a]">{value}</p>
        )}
      </div>
    </div>
  );
}

export function DeviceStatusCard({ deviceStatus }: DeviceStatusCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lastUploadDate = new Date(deviceStatus.lastUpload);
  const secondsAgo = Math.floor((Date.now() - lastUploadDate.getTime()) / 1000);
  const lastUploadStr = mounted ? (secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`) : 'Just now';

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1c1c1a] font-bold text-base">Device Status</h3>
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
