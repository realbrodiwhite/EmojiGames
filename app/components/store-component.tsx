"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: number
  date: Date
}

export function StoreComponent({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance)
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const exchangeRate = 0.01 // 1 CRDS = $0.01 USD

  useEffect(() => {
    // In a real app, you'd fetch this data from your API
    const fetchTransactions = async () => {
      // Simulated API call
      const response = await new Promise<Transaction[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              { id: "1", type: "buy", amount: 1000, date: new Date("2023-05-01") },
              { id: "2", type: "sell", amount: 500, date: new Date("2023-05-02") },
              { id: "3", type: "buy", amount: 2000, date: new Date("2023-05-03") },
            ]),
          1000,
        ),
      )
      setTransactions(response)
    }

    fetchTransactions()
  }, [])

  const handleBuy = async () => {
    const amount = Number.parseInt(buyAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/store/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to process purchase")
      }

      const { newBalance } = await response.json()

      setBalance(newBalance)
      setTransactions([{ id: Date.now().toString(), type: "buy", amount, date: new Date() }, ...transactions])
      setBuyAmount("")

      toast({
        title: "Purchase successful",
        description: `You bought ${amount} CRDS for $${(amount * exchangeRate).toFixed(2)} USD`,
      })
    } catch (error) {
      console.error("Error processing purchase:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing your purchase. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSell = async () => {
    const amount = Number.parseInt(sellAmount)
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to sell.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/store/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to process sale")
      }

      const { newBalance } = await response.json()

      setBalance(newBalance)
      setTransactions([{ id: Date.now().toString(), type: "sell", amount, date: new Date() }, ...transactions])
      setSellAmount("")

      toast({
        title: "Sale successful",
        description: `You sold ${amount} CRDS for $${(amount * exchangeRate).toFixed(2)} USD`,
      })
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing your sale. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {balance === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to the CRDS Store!</CardTitle>
            <CardDescription>You currently have no credits. Purchase some to start playing!</CardDescription>
          </CardHeader>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buy CRDS</CardTitle>
            <CardDescription>1 CRDS = ${exchangeRate.toFixed(2)} USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="Amount to buy"
              />
              <Button onClick={handleBuy}>Buy</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sell CRDS</CardTitle>
            <CardDescription>1 CRDS = ${exchangeRate.toFixed(2)} USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="Amount to sell"
              />
              <Button onClick={handleSell} disabled={balance === 0}>
                Sell
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{balance} CRDS</p>
          <p className="text-lg">Equivalent to ${(balance * exchangeRate).toFixed(2)} USD</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Value (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type === "buy" ? "Buy" : "Sell"}</TableCell>
                  <TableCell>{transaction.amount} CRDS</TableCell>
                  <TableCell>${(transaction.amount * exchangeRate).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

