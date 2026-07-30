export interface ThingSpeakNode {
  id: string;
  name: string;
  channelId: string;
  apiKey: string;
}

/**
 * Returns the list of configured ThingSpeak nodes.
 * By default, it includes the primary node configured via environment variables.
 * You can add additional hardcoded nodes here, or load them from a JSON env variable.
 */
export function getNodes(): ThingSpeakNode[] {
  const nodes: ThingSpeakNode[] = [];

  // 1. Primary node from .env.local
  const defaultChannelId = process.env.THINGSPEAK_CHANNEL_ID;
  const defaultApiKey = process.env.THINGSPEAK_READ_API_KEY;
  
  if (defaultChannelId && defaultApiKey) {
    nodes.push({
      id: "primary",
      name: "Main Sensor (Env)",
      channelId: defaultChannelId,
      apiKey: defaultApiKey,
    });
  }

  // 2. Load from JSON config if available (e.g. NODES_CONFIG=[{"id":"...", ...}])
  const envNodes = process.env.NODES_CONFIG;
  if (envNodes) {
    try {
      const parsed = JSON.parse(envNodes);
      if (Array.isArray(parsed)) {
        nodes.push(...parsed);
      }
    } catch (err) {
      console.warn("Failed to parse NODES_CONFIG from env:", err);
    }
  }

  return nodes;
}

export function getNodeById(id: string): ThingSpeakNode | undefined {
  return getNodes().find((n) => n.id === id);
}
