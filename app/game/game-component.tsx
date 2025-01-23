"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Nav } from "../components/nav"
import { InfoModal } from "../components/info-modal"
import { BonusGame } from "../components/bonus-game"
import type { Theme } from "@/lib/themes"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface GameComponentProps {
  initialJackpot: number
  initialTheme: Theme
  initialBalance: number
  userId: string
}

export function GameComponent({ initialJackpot, initialTheme, initialBalance, userId }: GameComponentProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [reels, setReels] = useState(Array(5).fill(Array(3).fill(theme.symbols[theme.symbols.length - 1])))
  const [betAmount, setBetAmount] = useState(10)
  const [message, setMessage] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [jackpot, setJackpot] = useState(initialJackpot)
  const [showBonusGame, setShowBonusGame] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { user, updateBalance } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user && user.id !== userId) {
      updateBalance(initialBalance)
    }
  }, [user, userId, initialBalance, updateBalance])

  useEffect(() => {
    setReels(Array(5).fill(Array(3).fill(theme.symbols[theme.symbols.length - 1])))
    if (audioRef.current) {
      audioRef.current.src = theme.backgroundMusic
      audioRef.current.loop = true
      audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))
    }
  }, [theme])

  useEffect(() => {
    const eventSource = new EventSource("/api/jackpot-sse")
    eventSource.onmessage = (event) => {
      setJackpot(JSON.parse(event.data).jackpot)
    }
    return () => eventSource.close()
  }, [])

  const playSound = (soundType: "spin" | "win" | "bonus" | "jackpot") => {
    const audio = new Audio(theme.soundEffects[soundType] || theme.soundEffects.win)
    audio.play().catch((error) => console.error("Audio playback failed:", error))
  }

  const spin = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to play.",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    if (user.balance < betAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough CRDS to place this bet.",
        variant: "destructive",
      })
      return
    }

    setIsSpinning(true)
    updateBalance(user.balance - betAmount)
    playSound("spin")

    const newReels = reels.map(() =>
      Array.from({ length: 3 }, () => theme.symbols[Math.floor(Math.random() * theme.symbols.length)]),
    )

    try {
      const response = await fetch("/api/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reels: newReels,
          theme: theme.name,
          betAmount,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process spin")
      }

      const { winAmount, winLines, isJackpot, newJackpot, newBalance, bonusTriggered } = await response.json()

      setTimeout(() => {
        setReels(newReels)
        setIsSpinning(false)
        updateBalance(newBalance)
        setJackpot(newJackpot)

        if (isJackpot) {
          setMessage(`JACKPOT! You won ${winAmount} CRDS!`)
          playSound("jackpot")
        } else if (winAmount > 0) {
          setMessage(`You won ${winAmount} CRDS!`)
          playSound("win")
        } else {
          setMessage("Spin again!")
        }

        if (bonusTriggered) {
          setShowBonusGame(true)
          playSound("bonus")
        }
      }, 3000) // Wait for 3 seconds before showing the result
    } catch (error) {
      console.error("Error processing game result:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing your spin. Please try again.",
        variant: "destructive",
      })
      setIsSpinning(false)
    }
  }

  const handleBonusComplete = async (bonusWinAmount: number) => {
    setShowBonusGame(false)
    try {
      const response = await fetch("/api/bonus-win", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user!.id,
          winAmount: bonusWinAmount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process bonus win")
      }

      const { newBalance } = await response.json()
      updateBalance(newBalance)
      setMessage(`You won ${bonusWinAmount} CRDS in the bonus game!`)
    } catch (error) {
      console.error("Error processing bonus win:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing your bonus win. Please contact support.",
        variant: "destructive",
      })
    }
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = Math.max(1, Math.min(100, Number(e.target.value)))
    setBetAmount(newBet)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.backgroundColor}`}>
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">{theme.name} Slot Machine</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-5 gap-2 mb-8 h-64">
            {reels.map((reel, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-lg bg-gray-200">
                <AnimatePresence>
                  {reel.map((symbol, j) => (
                    <motion.div
                      key={`${i}-${j}-${isSpinning}`}
                      className="flex items-center justify-center h-full text-4xl"
                      initial={{ y: isSpinning ? -100 * (theme.symbols.length - 1) : 0 }}
                      animate={{
                        y: isSpinning ? [null, 100 * (theme.symbols.length + j)] : 0,
                      }}
                      exit={{ y: 100 }}
                      transition={{
                        duration: isSpinning ? 3 : 0,
                        ease: isSpinning ? "linear" : "easeInOut",
                        repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                      }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="text-center mb-4">
            <p className="text-xl font-bold">Balance: {user?.balance} CRDS</p>
            <p className="text-lg">{message}</p>
            <p className="text-lg font-bold text-primary">Jackpot: {jackpot} CRDS</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="betAmount" className="mr-2">
              Bet Amount:
            </label>
            <Input
              id="betAmount"
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              min="1"
              max="100"
              className="w-24"
            />
          </div>
          <div className="flex justify-between items-center">
            <InfoModal theme={theme} />
            <Button onClick={spin} disabled={isSpinning} size="lg">
              {isSpinning ? "Spinning..." : `Spin (${betAmount} CRDS)`}
            </Button>
          </div>
        </div>
      </main>
      {showBonusGame && <BonusGame onComplete={handleBonusComplete} />}
      <audio ref={audioRef} />
    </div>
  )
}

