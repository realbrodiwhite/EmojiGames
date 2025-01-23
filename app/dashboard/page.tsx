import { Suspense } from "react"
import { Nav } from "../components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaderboard } from "../components/leaderboard"
import { getUserData } from "@/lib/user-data"

export const revalidate = 0 // disable static generation

export default async function Dashboard() {
  const userData = await getUserData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">User Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading user stats...</div>}>
            <UserStats userData={userData} />
          </Suspense>
          <Suspense fallback={<div>Loading leaderboard...</div>}>
            <Leaderboard />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function UserStats({ userData }: { userData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Balance: {userData.balance} CRDS</p>
        <p className="text-2xl font-bold">Games Played: {userData.gamesPlayed}</p>
        <p className="text-2xl font-bold">Total Winnings: {userData.totalWinnings} CRDS</p>
      </CardContent>
    </Card>
  )
}

