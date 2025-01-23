import { Suspense } from "react"
import { GameComponent } from "./game-component"
import { getServerSideProps } from "./server-props"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { kv } from "@vercel/kv"

export const revalidate = 0 // disable static generation

export default async function GamePage({
  searchParams,
}: {
  searchParams: { theme: string }
}) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    redirect("/auth/signin")
  }

  const user = await kv.hgetall(`user:${userId}`)

  if (!user) {
    redirect("/auth/signin")
  }

  const { initialJackpot, theme } = await getServerSideProps(searchParams.theme)

  // Fetch initial jackpot value here
  const currentJackpot = (await kv.get("jackpot")) || initialJackpot

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent
        initialJackpot={currentJackpot}
        initialTheme={theme}
        initialBalance={Number(user.balance) || 0}
        userId={userId}
      />
    </Suspense>
  )
}

