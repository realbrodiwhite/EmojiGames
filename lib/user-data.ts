import { kv } from "@vercel/kv"
import { cookies } from "next/headers"
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export async function getUserData() {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return null // Return null instead of throwing an error
  }

  const userData = await kv.hgetall(`user:${userId}`)
  if (!userData) {
    return null // Return null if user data is not found
  }

  // Fetching Edge Config settings
  const { defaultBalance } = await getEdgeConfig('userConfig');

  return {
    balance: Number(userData.balance) || defaultBalance || 0, // Using Edge Config for default balance
    gamesPlayed: Number(userData.gamesPlayed) || 0,
    totalWinnings: Number(userData.totalWinnings) || 0,
  }
}
