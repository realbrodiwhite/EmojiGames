import type { Theme } from "./themes"
import { kv } from "@vercel/kv" // Importing Vercel KV
import { getEdgeConfig } from '@vercel/edge-config' // Importing Edge Config

export interface WinResult {
  winAmount: number
  winLines: number[][]
  isJackpot: boolean
  newJackpot: number
}

export async function checkWins(reels: string[][], theme: Theme, betAmount: number, jackpotAmount: number): Promise<WinResult> {
  let winAmount = 0
  const winLines: number[][] = []
  let isJackpot = false
  let newJackpot = jackpotAmount

  // Fetching Edge Config settings for multipliers
  const { winMultiplier } = await getEdgeConfig('gameConfig'); // Fetching Edge Config settings

  theme.winLines.forEach(({ line, multiplier }) => {
    const symbols = line.map((row, col) => reels[col][row])
    const uniqueSymbols = new Set(symbols)

    if (uniqueSymbols.size === 1 || (uniqueSymbols.size === 2 && uniqueSymbols.has(theme.bonusSymbol))) {
      const symbol = symbols.find((s) => s !== theme.bonusSymbol) || theme.bonusSymbol
      const symbolValue = theme.symbolValues[symbol]
      if (typeof symbolValue === "number") {
        winAmount += symbolValue * multiplier * betAmount * (winMultiplier || 1); // Using Edge Config for win multiplier
        winLines.push(line)
      }
    }
  })

  // Check for jackpot (all symbols are the same and it's the highest value symbol)
  const allSymbols = reels.flat()
  const uniqueSymbols = new Set(allSymbols)
  if (uniqueSymbols.size === 1 && allSymbols[0] === theme.symbols[theme.symbols.length - 1]) {
    isJackpot = true
    winAmount += jackpotAmount
    newJackpot = 1000 // Reset jackpot after win
  } else {
    newJackpot += betAmount * 0.1 // 10% of bet goes to jackpot if not won
  }

  // Check for scatter wins
  const scatterCount = allSymbols.filter((s) => s === theme.scatterSymbol).length
  if (scatterCount >= 3) {
    winAmount += betAmount * scatterCount * 2
  }

  // Optionally store win data in Vercel KV
  await kv.hset(`winData:${Date.now()}`, { winAmount, winLines, isJackpot, newJackpot });

  return { winAmount, winLines, isJackpot, newJackpot }
}

export function triggerBonus(reels: string[][], theme: Theme): boolean {
  const bonusSymbolCount = reels.flat().filter((s) => s === theme.bonusSymbol).length
  return bonusSymbolCount >= 3
}
