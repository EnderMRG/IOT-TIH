import { NextResponse } from "next/server";

// Guwahati, Assam coordinates
const LAT = 26.1445;
const LON = 91.7362;

// Open-Meteo — no API key required, completely free
const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation` +
  `&hourly=precipitation_probability,precipitation` +
  `&daily=precipitation_sum,weather_code,temperature_2m_max,temperature_2m_min` +
  `&timezone=Asia%2FKolkata` +
  `&forecast_days=3`;

export interface WeatherData {
  current: {
    temperature: number;       // °C
    feelsLike: number;         // °C
    humidity: number;          // %
    precipitation: number;     // mm in last hour
    windSpeed: number;         // km/h
    weatherCode: number;
    condition: string;
    conditionGroup: "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";
  };
  forecast: {
    next3hPrecipProb: number;  // % chance of rain in next 3 hours
    next3hPrecip: number;      // mm expected in next 3 hours
    todayPrecipSum: number;    // mm total for today
    tomorrowPrecipSum: number; // mm total for tomorrow
  };
  floodRiskContext: "low" | "moderate" | "high" | "critical";
  floodRiskMessage: string;
  location: string;
  updatedAt: string;
}

/** WMO Weather Interpretation Codes → human label + group */
function interpretWeatherCode(code: number): { condition: string; group: WeatherData["current"]["conditionGroup"] } {
  if (code === 0)              return { condition: "Clear Sky",          group: "clear" };
  if (code <= 2)               return { condition: "Partly Cloudy",      group: "cloudy" };
  if (code === 3)              return { condition: "Overcast",            group: "cloudy" };
  if (code <= 49)              return { condition: "Foggy",              group: "fog" };
  if (code <= 57)              return { condition: "Drizzle",            group: "rain" };
  if (code <= 65)              return { condition: "Rain",               group: "rain" };
  if (code <= 77)              return { condition: "Snow",               group: "snow" };
  if (code <= 82)              return { condition: "Rain Showers",       group: "rain" };
  if (code <= 86)              return { condition: "Snow Showers",       group: "snow" };
  if (code <= 99)              return { condition: "Thunderstorm",       group: "storm" };
  return                              { condition: "Unknown",            group: "cloudy" };
}

/** Compute flood risk based on precipitation and sensor context */
function computeFloodRisk(
  precipNow: number,
  next3h: number,
  todayTotal: number
): { risk: WeatherData["floodRiskContext"]; message: string } {
  if (next3h > 30 || todayTotal > 80) {
    return {
      risk: "critical",
      message: "Extreme rainfall forecast — All nodes on highest alert.",
    };
  }
  if (next3h > 15 || todayTotal > 40) {
    return {
      risk: "high",
      message: "Heavy rain expected — Monitor water levels closely.",
    };
  }
  if (next3h > 5 || precipNow > 1) {
    return {
      risk: "moderate",
      message: "Moderate rain expected — Stay alert for rising levels.",
    };
  }
  return {
    risk: "low",
    message: "No significant rainfall forecast — Conditions stable.",
  };
}

export async function GET() {
  try {
    const res = await fetch(OPEN_METEO_URL, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    const raw = await res.json();

    const current = raw.current;
    const hourly  = raw.hourly;
    const daily   = raw.daily;

    // Average precipitation probability for next 3 hourly slots
    const next3hPrecipProb = Math.round(
      (hourly.precipitation_probability.slice(0, 3) as number[]).reduce((a: number, b: number) => a + b, 0) / 3
    );
    const next3hPrecip = (hourly.precipitation.slice(0, 3) as number[]).reduce((a: number, b: number) => a + b, 0);

    const { condition, group } = interpretWeatherCode(current.weather_code);
    const { risk, message } = computeFloodRisk(
      current.precipitation,
      next3hPrecip,
      daily.precipitation_sum[0] ?? 0
    );

    const weather: WeatherData = {
      current: {
        temperature:   current.temperature_2m,
        feelsLike:     current.apparent_temperature,
        humidity:      current.relative_humidity_2m,
        precipitation: current.precipitation,
        windSpeed:     current.wind_speed_10m,
        weatherCode:   current.weather_code,
        condition,
        conditionGroup: group,
      },
      forecast: {
        next3hPrecipProb,
        next3hPrecip:       parseFloat(next3hPrecip.toFixed(1)),
        todayPrecipSum:     daily.precipitation_sum[0] ?? 0,
        tomorrowPrecipSum:  daily.precipitation_sum[1] ?? 0,
      },
      floodRiskContext: risk,
      floodRiskMessage: message,
      location: "Guwahati, Assam",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(weather);
  } catch (err: any) {
    console.error("[/api/weather]", err);
    return NextResponse.json({ error: err.message ?? "Failed to fetch weather" }, { status: 500 });
  }
}
