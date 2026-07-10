"use client";

import { useState, memo } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl/maplibre";
import { Droplets } from "lucide-react";

interface EcoMapProps {
  distance: number;
  temperature: number;
  humidity: number;
}

function EcoMapComponent({ distance, temperature, humidity }: EcoMapProps) {
  const [showPopup, setShowPopup] = useState(false);

  // The coordinates where the ESP32 device is deployed (IIT Guwahati)
  const deviceLongitude = 91.6951;
  const deviceLatitude = 26.1921;

  return (
    <div className="h-[400px] w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm relative">
      <Map
        initialViewState={{
          longitude: deviceLongitude,
          latitude: deviceLatitude,
          zoom: 12,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || 'rzVkbH1vpTJGqWlyH7ro'}`}
      >
        <NavigationControl position="top-right" />

        <Marker 
          longitude={deviceLongitude} 
          latitude={deviceLatitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setShowPopup(true);
          }}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border-2 border-white animate-bounce cursor-pointer">
            <Droplets className="w-5 h-5" />
          </div>
        </Marker>

        {showPopup && (
          <Popup
            longitude={deviceLongitude}
            latitude={deviceLatitude}
            closeButton={false}
            closeOnClick={true}
            onClose={() => setShowPopup(false)}
            anchor="bottom"
            offset={25}
            className="rounded-xl overflow-hidden shadow-xl"
          >
            <div className="p-1 min-w-[140px]">
              <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">FloodEye Node 1</h3>
              <div className="space-y-1.5 text-sm">
                <p className="flex justify-between">
                  <span className="text-slate-500">Water Level</span>
                  <span className="font-semibold text-blue-600">{distance.toFixed(0)} cm</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Temp</span>
                  <span className="font-semibold text-slate-900">{temperature.toFixed(1)}°C</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Humidity</span>
                  <span className="font-semibold text-slate-900">{humidity.toFixed(0)}%</span>
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default memo(EcoMapComponent);
