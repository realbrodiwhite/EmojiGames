import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export async function GET() {
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      while (true) {
        const { initialJackpot } = await getEdgeConfig('jackpotConfig'); // Fetching Edge Config settings
        const jackpot = (await kv.get("jackpot")) || initialJackpot || 1000; // Using Edge Config for initial jackpot
        const data = encoder.encode(`data: ${JSON.stringify({ jackpot })}\n\n`)
        controller.enqueue(data)
        await new Promise((resolve) => setTimeout(resolve, 5000)) // Update every 5 seconds
      }
    },
  })

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
