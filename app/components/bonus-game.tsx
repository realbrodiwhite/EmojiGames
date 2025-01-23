"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface BonusGameProps {
  onComplete: (winAmount: number) => void
}

const symbols = ["🍒", "🍋", "🍊", "🍇", "🍉", "💎"]

export function BonusGame({ onComplete }: BonusGameProps) {
  const [grid, setGrid] = useState<string[][]>(Array(3).fill(Array(3).fill("")))
  const [selectedCells, setSelectedCells] = useState<number[]>([])
  const [winAmount, setWinAmount] = useState(0)

  useEffect(() => {
    const newGrid = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => symbols[Math.floor(Math.random() * symbols.length)]),
      )
    setGrid(newGrid)
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (selectedCells.length < 3 && !selectedCells.includes(row * 3 + col)) {
      const newSelectedCells = [...selectedCells, row * 3 + col]
      setSelectedCells(newSelectedCells)

      if (newSelectedCells.length === 3) {
        const selectedSymbols = newSelectedCells.map((cell) => grid[Math.floor(cell / 3)][cell % 3])
        const uniqueSymbols = new Set(selectedSymbols)

        let win = 0
        if (uniqueSymbols.size === 1) {
          win = 100 // All three symbols match
        } else if (uniqueSymbols.size === 2) {
          win = 20 // Two symbols match
        } else {
          win = 5 // No symbols match
        }

        setWinAmount(win)
        setTimeout(() => onComplete(win), 2000)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bonus Game!</h2>
        <p className="mb-4">Select 3 cells to reveal your prize:</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {grid.map((row, rowIndex) =>
            row.map((symbol, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 bg-primary text-primary-foreground flex items-center justify-center text-4xl cursor-pointer ${
                  selectedCells.includes(rowIndex * 3 + colIndex) ? "bg-secondary" : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                animate={selectedCells.includes(rowIndex * 3 + colIndex) ? { rotateY: 180 } : {}}
                transition={{ duration: 0.5 }}
              >
                {selectedCells.includes(rowIndex * 3 + colIndex) ? symbol : "?"}
              </motion.div>
            )),
          )}
        </div>
        {winAmount > 0 && <p className="text-xl font-bold">You won {winAmount} CRDS!</p>}
      </div>
    </div>
  )
}

