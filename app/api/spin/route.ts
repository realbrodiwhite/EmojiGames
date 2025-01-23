import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { db } from "'lib/db'"
import { checkWins, triggerBonus } from "'lib/game-logic'"
import { themes } from "'lib/themes'"
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export async function POST(request: Request) {
  const { reels, theme: themeName, betAmount, userId } = await request.json()

  const theme = themes.find((t) => t.name === themeName)
  if (!theme) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 })
  }

  const user = await kv.hgetall(`user:${userId}`)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.balance < betAmount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
  }

  // Fetching Edge Config settings
  const { initialJackpot } = await getEdgeConfig('jackpotConfig'); // Fetching Edge Config settings
  let jackpot = (await kv.get("jackpot")) || initialJackpot || 1000;
  jackpot += betAmount * 0.1 // 10% of bet goes to jackpot

  const { winAmount, winLines, isJackpot } = checkWins(reels, theme, betAmount, jackpot)
  const bonusTriggered = triggerBonus(reels, theme)

  // Update user balance
  const newBalance = user.balance - betAmount + winAmount
  await kv.hset(`user:${userId}`, { balance: newBalance })

  // Reset jackpot if won
  if (isJackpot) {
    jackpot = 1000 // Reset to initial amount
  }

  await kv.set("jackpot", jackpot)

  // Log the spin
  await db.query(
    "INSERT INTO spins (user_id, bet_amount, win_amount, is_jackpot, bonus_triggered) VALUES ($1, $2, $3, $4, $5)",
    [userId, betAmount, winAmount, isJackpot, bonusTriggered],
  )

  return NextResponse.json({
    winAmount,
    winLines,
    bonusTriggered,
    isJackpot,
    newBalance,
    newJackpot: jackpot,
  })
}
