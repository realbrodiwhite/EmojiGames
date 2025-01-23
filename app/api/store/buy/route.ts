import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { cookies } from "next/headers"
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export async function POST(request: Request) {
  const { amount } = await request.json()
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const user = await kv.hgetall(`user:${userId}`)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Fetching Edge Config settings
  const { purchaseLimit } = await getEdgeConfig('purchaseConfig'); // Fetching Edge Config settings

  const newBalance = ((user.balance as number) || 0) + amount
  if (newBalance > purchaseLimit) {
    return NextResponse.json({ error: "Purchase limit exceeded" }, { status: 400 })
  }

  await kv.hset(`user:${userId}`, { balance: newBalance })

  return NextResponse.json({ newBalance })
}
