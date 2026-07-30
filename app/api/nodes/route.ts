import { NextResponse } from "next/server";
import { getNodes } from "@/lib/nodes";

export async function GET() {
  const nodes = getNodes().map((n) => ({
    id: n.id,
    name: n.name,
    // We intentionally do not expose channelId or apiKey to the client
  }));
  return NextResponse.json(nodes);
}
