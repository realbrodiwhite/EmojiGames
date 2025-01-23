"use client"

import { useState, useEffect } from "react"
import { Nav } from "../components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface UserData {
  id: string
  username: string
  balance: number
  gamesPlayed: number
  totalWinnings: number
}

interface GameStats {
  date: string
  totalBets: number
  totalWinnings: number
  uniquePlayers: number
}

export default function AdminPanel() {
  const [rtp, setRtp] = useState(95)
  const [users, setUsers] = useState<UserData[]>([])
  const [gameStats, setGameStats] = useState<GameStats[]>([])

  useEffect(() => {
    // In a real application, you'd fetch this data from your API
    const fetchData = async () => {
      // Simulated API calls
      const usersResponse = await new Promise<UserData[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              { id: "1", username: "player1", balance: 5000, gamesPlayed: 100, totalWinnings: 10000 },
              { id: "2", username: "player2", balance: 4500, gamesPlayed: 90, totalWinnings: 9000 },
              { id: "3", username: "player3", balance: 4000, gamesPlayed: 80, totalWinnings: 8000 },
            ]),
          1000,
        ),
      )
      setUsers(usersResponse)

      const statsResponse = await new Promise<GameStats[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              { date: "2023-05-01", totalBets: 1000, totalWinnings: 950, uniquePlayers: 50 },
              { date: "2023-05-02", totalBets: 1200, totalWinnings: 1140, uniquePlayers: 60 },
              { date: "2023-05-03", totalBets: 1100, totalWinnings: 1045, uniquePlayers: 55 },
              { date: "2023-05-04", totalBets: 1300, totalWinnings: 1235, uniquePlayers: 65 },
              { date: "2023-05-05", totalBets: 1500, totalWinnings: 1425, uniquePlayers: 75 },
            ]),
          1000,
        ),
      )
      setGameStats(statsResponse)
    }

    fetchData()
  }, [])

  const handleRtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtp(Number(e.target.value))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>RTP Settings</CardTitle>
              <CardDescription>Adjust the Return to Player percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input type="number" value={rtp} onChange={handleRtpChange} min="1" max="100" />
                <span>%</span>
              </div>
              <Button className="mt-4" onClick={() => alert(`RTP set to ${rtp}%`)}>
                Save RTP
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Balance (CRDS)</TableHead>
                    <TableHead>Games Played</TableHead>
                    <TableHead>Total Winnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                      <TableCell>{user.gamesPlayed}</TableCell>
                      <TableCell>{user.totalWinnings}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Game Statistics</CardTitle>
            <CardDescription>Daily game statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gameStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalBets" stroke="#8884d8" yAxisId="left" />
                <Line type="monotone" dataKey="totalWinnings" stroke="#82ca9d" yAxisId="left" />
                <Line type="monotone" dataKey="uniquePlayers" stroke="#ffc658" yAxisId="right" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

