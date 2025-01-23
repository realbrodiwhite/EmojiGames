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

  const currentBalance = (user.balance as number) || 0
  if (currentBalance < amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
  }

  // Fetching Edge Config settings
  const { sellFee } = await getEdgeConfig('sellConfig'); // Fetching Edge Config settings

  const newBalance = currentBalance - amount - (sellFee || 0); // Deducting sell fee if applicable
  await kv.hset(`user:${userId}`, { balance: newBalance })

  return NextResponse.json({ newBalance })
}
