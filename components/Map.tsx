"use client";

import { useState, useEffect, memo } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl/maplibre";
import { Droplets } from "lucide-react";

interface EcoMapProps {
  nodes?: { id: string; name: string }[];
  activeNodeId?: string;
  onNodeSelect?: (id: string) => void;
  distance: number;
  temperature: number;
  humidity: number;
}

function EcoMapComponent({ nodes = [], activeNodeId, onNodeSelect, distance, temperature, humidity }: EcoMapProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  useEffect(() => {
    if (activeNodeId) {
      setActivePopup(activeNodeId);
    }
  }, [activeNodeId]);

  // The coordinates where the primary ESP32 device is deployed (IIT Guwahati)
  const baseLng = 91.6951;
  const baseLat = 26.1921;

  // For visual separation, we offset subsequent nodes
  // For visual separation, we offset subsequent nodes closer together
  const nodeLocations = nodes.map((n, i) => ({
    ...n,
    lng: baseLng + (i * 0.005),
    lat: baseLat - (i * 0.002)
  }));

  // The coordinates where the ESP32 device is deployed (IIT Guwahati)
  const deviceLongitude = 91.6951;
  const deviceLatitude = 26.1921;

  return (
    <div className="h-[400px] w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm relative">
      <Map
        initialViewState={{
          longitude: baseLng + (nodes.length > 1 ? 0.0025 : 0),
          latitude: baseLat - (nodes.length > 1 ? 0.001 : 0),
          zoom: nodes.length > 1 ? 14 : 12,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || 'rzVkbH1vpTJGqWlyH7ro'}`}
      >
        <NavigationControl position="top-right" />

        {nodeLocations.map((node) => (
          <Marker 
            key={node.id}
            longitude={node.lng} 
            latitude={node.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onNodeSelect?.(node.id);
              setActivePopup(node.id);
            }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white cursor-pointer transition-all duration-300 ${node.id === activeNodeId ? "bg-blue-600 shadow-blue-600/30 animate-bounce scale-110" : "bg-slate-400 opacity-80 hover:bg-slate-500 scale-90"}`}>
              <Droplets className="w-5 h-5" />
            </div>
          </Marker>
        ))}

        {activePopup && (() => {
          const popupNode = nodeLocations.find(n => n.id === activePopup);
          if (!popupNode) return null;
          
          return (
            <Popup
              longitude={popupNode.lng}
              latitude={popupNode.lat}
              closeButton={false}
              closeOnClick={true}
              onClose={() => setActivePopup(null)}
              anchor="bottom"
              offset={25}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              <div className="p-1 min-w-[140px]">
                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">{popupNode.name}</h3>
                {popupNode.id === activeNodeId ? (
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Water Level</span>
                      <span className="font-semibold text-blue-600">{distance === -999 ? 'N/A' : `${distance.toFixed(0)} cm`}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Temp</span>
                      <span className="font-semibold text-slate-900">{temperature === -999 ? 'N/A' : `${temperature.toFixed(1)}°C`}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Humidity</span>
                      <span className="font-semibold text-slate-900">{humidity === -999 ? 'N/A' : `${humidity.toFixed(0)}%`}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic mt-2">Connecting...</p>
                )}
              </div>
            </Popup>
          );
        })()}
      </Map>
    </div>
  );
}

export default memo(EcoMapComponent);
