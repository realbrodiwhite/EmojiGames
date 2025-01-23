import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { db } from "./db" // Correcting the import statement
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export async function POST(request: Request) {
  const { userId, winAmount } = await request.json()

  const user = await kv.hgetall(`user:${userId}`)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Update user balance
  const newBalance = user.balance + winAmount
  await kv.hset(`user:${userId}`, { balance: newBalance })

  // Log the bonus win
  await db.query("INSERT INTO bonus_wins (user_id, win_amount) VALUES ($1, $2)", [userId, winAmount])

  return NextResponse.json({
    newBalance,
  })
}
