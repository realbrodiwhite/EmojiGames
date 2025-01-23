import { kv } from "@vercel/kv"
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

if (!process.env.KV_URL || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error("Vercel KV environment variables are not set")
}

// Fetching Edge Config settings
const { kvConfig } = await getEdgeConfig('kvConfig');

export { kv, kvConfig }
