"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeatherData } from "@/app/api/weather/route";

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Refresh every 30 minutes on the client side (matches server cache)
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch weather");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const timer = setInterval(fetch_, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetch_]);

  return { weather, isLoading, error, refetch: fetch_ };
}
