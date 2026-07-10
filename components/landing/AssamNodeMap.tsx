"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/* ── Node definitions ──────────────────────────────────────────── */
const NODES = [
  {
    id: "NODE-01",
    name: "Brahmaputra River",
    location: "Guwahati",
    lat: 26.1445,
    lng: 91.7362,
    status: "warning" as const,
    waterLevel: "1.42 m",
    temp: "28.3°C",
    humidity: "87%",
  },
  {
    id: "NODE-02",
    name: "Kaziranga Wetlands",
    location: "Nagaon",
    lat: 26.5775,
    lng: 93.17,
    status: "normal" as const,
    waterLevel: "0.62 m",
    temp: "26.1°C",
    humidity: "79%",
  },
  {
    id: "NODE-03",
    name: "Barak Valley",
    location: "Silchar",
    lat: 24.8333,
    lng: 92.7789,
    status: "critical" as const,
    waterLevel: "2.18 m",
    temp: "30.7°C",
    humidity: "93%",
  },
  {
    id: "NODE-04",
    name: "Subansiri River",
    location: "Dhemaji",
    lat: 27.4728,
    lng: 94.5614,
    status: "normal" as const,
    waterLevel: "0.55 m",
    temp: "24.9°C",
    humidity: "75%",
  },
] as const;

/* ── Status colour map ──────────────────────────────────────────── */
const STATUS_MAP = {
  normal: {
    dot: "#10b981",
    ring: "#34d399",
    label: "Normal",
    badge: "bg-emerald-500/20 border-emerald-400/50 text-emerald-300",
  },
  warning: {
    dot: "#f59e0b",
    ring: "#fbbf24",
    label: "Warning",
    badge: "bg-amber-500/20 border-amber-400/50 text-amber-300",
  },
  critical: {
    dot: "#ef4444",
    ring: "#f87171",
    label: "Critical",
    badge: "bg-red-500/20 border-red-400/50 text-red-300",
  },
};

type NodeStatus = keyof typeof STATUS_MAP;

/* ── Animated marker pin ────────────────────────────────────────── */
function NodePin({ status, active }: { status: NodeStatus; active: boolean }) {
  const { dot, ring } = STATUS_MAP[status];
  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{
        width: 40,
        height: 40,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inline-flex rounded-full animate-ping"
        style={{
          width: 30,
          height: 30,
          background: ring,
          opacity: 0.4,
          animationDuration: "2.2s",
        }}
      />
      {/* Outer halo */}
      <span
        className="absolute rounded-full border-2 transition-all duration-200"
        style={{
          width: active ? 32 : 26,
          height: active ? 32 : 26,
          borderColor: ring,
          background: "rgba(5,12,28,0.7)",
        }}
      />
      {/* Core dot */}
      <span
        className="relative rounded-full z-10"
        style={{
          width: 11,
          height: 11,
          background: dot,
          boxShadow: `0 0 10px 3px ${dot}`,
        }}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function AssamNodeMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const MAPTILER_KEY =
    process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "rzVkbH1vpTJGqWlyH7ro";

  const MAP_STYLE = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`;

  const selectedNode = NODES.find((n) => n.id === activeNode) ?? null;

  return (
    <div
      className="relative w-full h-[340px] rounded-2xl overflow-hidden"
      style={{ overscrollBehavior: "none", touchAction: "none" }}
    >
      <Map
        initialViewState={{ longitude: 92.9, latitude: 26.2, zoom: 6.2 }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setActiveNode(null)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {NODES.map((node) => (
          <Marker
            key={node.id}
            longitude={node.lng}
            latitude={node.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveNode(activeNode === node.id ? null : node.id);
            }}
          >
            <NodePin status={node.status} active={activeNode === node.id} />
          </Marker>
        ))}

        {selectedNode && (
          <Popup
            longitude={selectedNode.lng}
            latitude={selectedNode.lat}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={24}
            className="assam-node-popup"
          >
            <div
              className="rounded-xl p-3 min-w-[175px]"
              style={{
                background: "rgba(8,16,32,0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2.5 border-b border-white/10 pb-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_MAP[selectedNode.status].dot }}
                />
                <div>
                  <p className="text-white text-xs font-bold leading-tight">
                    {selectedNode.name}
                  </p>
                  <p className="text-white/40 text-[10px] font-mono">
                    {selectedNode.location} · {selectedNode.id}
                  </p>
                </div>
              </div>
              {/* Stats */}
              <div className="space-y-1.5 text-[11px]">
                {[
                  {
                    label: "Water Level",
                    value: selectedNode.waterLevel,
                    highlight:
                      selectedNode.status === "critical" ||
                      selectedNode.status === "warning",
                  },
                  { label: "Temperature", value: selectedNode.temp, highlight: false },
                  { label: "Humidity", value: selectedNode.humidity, highlight: false },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between gap-6">
                    <span className="text-white/45">{label}</span>
                    <span
                      className={`font-semibold ${highlight ? "text-amber-300" : "text-white"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Status badge */}
              <div
                className={`mt-2.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold text-center ${
                  STATUS_MAP[selectedNode.status].badge
                }`}
              >
                {STATUS_MAP[selectedNode.status].label}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Strip default maplibre popup chrome */}
      <style>{`
        .assam-node-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .assam-node-popup .maplibregl-popup-tip { display: none !important; }
      `}</style>
    </div>
  );
}

