"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function Nav() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <nav className="flex justify-between items-center p-4 bg-gray-100">
        <Skeleton className="h-8 w-32" />
        <div className="space-x-4">
          <Skeleton className="h-10 w-24 inline-block" />
          <Skeleton className="h-10 w-24 inline-block" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-2xl font-bold">
        🎰 Emoji Slots
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            {pathname !== "/game" && (
              <Button asChild>
                <Link href="/game">Play</Link>
              </Button>
            )}
            {pathname !== "/dashboard" && (
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
            {pathname !== "/store" && (
              <Button asChild variant="outline">
                <Link href="/store">Store</Link>
              </Button>
            )}
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

