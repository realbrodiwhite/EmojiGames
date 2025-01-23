import { kv } from "@vercel/kv"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaderboardEntry {
  username: string
  balance: number
  gamesPlayed: number
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const users = await kv.scan(0, { match: "user:*", count: 100 })
  const leaderboard = await Promise.all(
    users[1].map(async (key) => {
      const user = await kv.hgetall(key)
      return {
        username: user.username as string,
        balance: (user.balance as number) || 0,
        gamesPlayed: (user.gamesPlayed as number) || 0,
      }
    }),
  )

  return leaderboard.sort((a, b) => b.balance - a.balance).slice(0, 5)
}

export async function Leaderboard() {
  const leaderboard = await getLeaderboard()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Games Played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.balance} CRDS</TableCell>
                <TableCell>{entry.gamesPlayed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

