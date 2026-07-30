import { NextRequest, NextResponse } from "next/server";
import { getLatestReading } from "@/lib/thingspeak";
import { getNodeById, getNodes } from "@/lib/nodes";

// Cache for 15 seconds — matches the ESP32 upload interval
export const revalidate = 15;

export async function GET(req: NextRequest) {
  const nodeId = req.nextUrl.searchParams.get("nodeId");
  let channelId: string | undefined;
  let apiKey: string | undefined;

  if (nodeId) {
    const node = getNodeById(nodeId);
    if (node) {
      channelId = node.channelId;
      apiKey = node.apiKey;
    }
  } else {
    // default to first node if exists
    const defaultNode = getNodes()[0];
    if (defaultNode) {
      channelId = defaultNode.channelId;
      apiKey = defaultNode.apiKey;
    }
  }

  const result = await getLatestReading(channelId, apiKey);

  if (!result) {
    return NextResponse.json(
      { error: "Failed to fetch data from ThingSpeak. Check your credentials in .env.local." },
      { status: 503 }
    );
  }

  return NextResponse.json(result);
}
