"use client";

import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { DeviceStatusCard } from "@/components/cards/DeviceStatusCard";
import { ShieldAlert, Server, Activity } from "lucide-react";

export default function DevicesPage() {
  const { deviceStatus, userRole } = useTelemetry();

  if (userRole !== "admin") {
    return (
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/40 rounded-[1.75rem] p-10 flex flex-col items-center justify-center h-[60vh] gap-4 text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-sky-300/60 to-transparent" />
        <div className="w-20 h-20 bg-red-50/80 rounded-full flex items-center justify-center text-red-500 mb-2">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-slate-500 mt-2 max-w-sm">You are logged in as a resident. Only system administrators can view raw device diagnostics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#1c1c1a] text-xl font-bold">Device Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DeviceStatusCard deviceStatus={deviceStatus} />
        </div>
        
        {/* Mock Data Payload View */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[1.75rem] p-6 shadow-xl shadow-slate-900/30 border border-slate-700/50 flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500/80 via-sky-400/80 to-transparent" />
          <div className="flex items-center gap-2 mb-4 text-slate-300">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm">Raw Telemetry Stream</h3>
          </div>
          <div className="flex-1 bg-black/50 rounded-xl p-4 overflow-y-auto border border-white/5">
            <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
              {JSON.stringify({
                node_id: "ESP32_AQUA_01",
                firmware: "v1.4.2",
                uptime_hrs: 342.1,
                last_ping: deviceStatus?.lastUpload ?? "N/A",
                signal_rssi: (deviceStatus?.rssi ?? 0) + " dBm",
                thingspeak_sync: deviceStatus?.thingspeakConnected ? "OK" : "ERR",
                sensor_i2c: "OK",
                sensor_ultrasonic: "OK"
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
