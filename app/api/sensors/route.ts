import { NextResponse } from "next/server";
import { getLatestReading } from "@/lib/thingspeak";

// Cache for 15 seconds — matches the ESP32 upload interval
export const revalidate = 15;

export async function GET() {
  const result = await getLatestReading();

  if (!result) {
    return NextResponse.json(
      { error: "Failed to fetch data from ThingSpeak. Check your credentials in .env.local." },
      { status: 503 }
    );
  }

  return NextResponse.json(result);
}
