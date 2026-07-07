import { NextResponse } from "next/server";
import { getLatestReading } from "@/lib/thingspeak";

export const revalidate = 15;

/**
 * Environmental Comfort Score (0–100)
 *
 * Based on three parameters (spec §14):
 *   - Temperature: ideal range 18–26 °C
 *   - Humidity:    ideal range 30–60 %
 *   - Pressure:    ideal range 1005–1025 hPa
 *
 * Each parameter contributes up to ~33 points. Scores outside ideal
 * ranges degrade linearly until they reach 0.
 */
function computeScore(temp: number, humidity: number, pressure: number): number {
  // Temperature component (0–34 pts)
  let tempScore = 0;
  if (temp >= 18 && temp <= 26) {
    tempScore = 34;
  } else if (temp < 18) {
    tempScore = Math.max(0, 34 - (18 - temp) * 3.4);
  } else {
    tempScore = Math.max(0, 34 - (temp - 26) * 3.4);
  }

  // Humidity component (0–33 pts)
  let humScore = 0;
  if (humidity >= 30 && humidity <= 60) {
    humScore = 33;
  } else if (humidity < 30) {
    humScore = Math.max(0, 33 - (30 - humidity) * 1.1);
  } else {
    humScore = Math.max(0, 33 - (humidity - 60) * 1.1);
  }

  // Pressure component (0–33 pts)
  let pressScore = 0;
  if (pressure >= 1005 && pressure <= 1025) {
    pressScore = 33;
  } else if (pressure < 1005) {
    pressScore = Math.max(0, 33 - (1005 - pressure) * 3.3);
  } else {
    pressScore = Math.max(0, 33 - (pressure - 1025) * 3.3);
  }

  return Math.round(tempScore + humScore + pressScore);
}

function scoreToStatus(score: number): string {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "Good";
  if (score >= 41) return "Moderate";
  return "Poor";
}

export async function GET() {
  const result = await getLatestReading();

  if (!result) {
    return NextResponse.json(
      { error: "Failed to fetch data from ThingSpeak." },
      { status: 503 }
    );
  }

  const { temperature, humidity, pressure } = result.data;
  const score = computeScore(temperature, humidity, pressure);

  return NextResponse.json({ score, status: scoreToStatus(score) });
}
