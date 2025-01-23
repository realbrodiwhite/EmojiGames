"use client"

import { useEffect, useState } from "react"
import { Nav } from "./components/nav"
import { ThemeSelector } from "./components/theme-selector"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("Home page rendered")
    console.log("User:", user)
    setIsLoading(false)
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
        <Nav />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Emoji Slot Machine!</h1>
        {user ? (
          <p className="text-center mb-8">Hello, {user.username}! Choose a theme to start playing:</p>
        ) : (
          <p className="text-center mb-8">Sign in or sign up to start playing!</p>
        )}
        <ThemeSelector />
      </main>
    </div>
  )
}

