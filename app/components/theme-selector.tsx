"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themes } from "@/lib/themes"

export function ThemeSelector() {
  const router = useRouter()

  const handleThemeSelect = (themeName: string) => {
    router.push(`/game?theme=${themeName}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {themes.map((theme) => (
        <Card
          key={theme.name}
          className="cursor-pointer transition-all hover:ring-2 hover:ring-primary"
          onClick={() => handleThemeSelect(theme.name)}
        >
          <CardHeader>
            <CardTitle>{theme.name}</CardTitle>
            <CardDescription>Click to start playing with this theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-2 text-4xl">
              {theme.symbols.slice(0, 5).map((symbol, index) => (
                <span key={index}>{symbol}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

