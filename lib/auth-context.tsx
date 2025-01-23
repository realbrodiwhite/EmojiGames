"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { kv } from "@vercel/kv"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { setCookie, getCookie, deleteCookie } from "cookies-next"
import bcrypt from 'bcryptjs'; // Importing bcryptjs for password hashing

interface User {
  id: string
  username: string
  email: string
  balance: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (username: string, email: string, password: string) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  updateBalance: (newBalance: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const userId = getCookie("userId") as string | undefined
      if (userId) {
        try {
          const userData = await kv.hgetall(`user:${userId}`)
          if (userData) {
            setUser({
              id: userId,
              username: userData.username as string,
              email: userData.email as string,
              balance: Number(userData.balance) || 0,
            })
          } else {
            setUser(null)
            deleteCookie("userId")
          }
        } catch (error) {
          console.error("Error checking authentication:", error)
          setUser(null)
          deleteCookie("userId")
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const userId = uuidv4()
      const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
      await kv.set(`user:${username}:id`, userId)
      await kv.hset(`user:${userId}`, {
        username,
        email,
        password: hashedPassword, // Storing the hashed password
        balance: 1000, // Initial balance of 1000 CRDS
      })
      const newUser: User = { id: userId, username, email, balance: 1000 }
      setUser(newUser)
      setCookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const userId = await kv.get(`user:${username}:id`)
      if (!userId) {
        throw new Error("User not found")
      }

      const userData = await kv.hgetall(`user:${userId}`)
      if (!userData) {
        throw new Error("User not found")
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password); // Verifying the hashed password
      if (!isPasswordValid) {
        throw new Error("Invalid credentials")
      }

      const newUser: User = {
        id: userId as string,
        username,
        email: userData.email as string,
        balance: Number(userData.balance) || 0,
      }
      setUser(newUser)
      setCookie("userId", userId as string, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    deleteCookie("userId")
    router.push("/auth/signin")
  }

  const updateBalance = async (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance }
      setUser(updatedUser)
      try {
        await kv.hset(`user:${user.id}`, { balance: newBalance })
      } catch (error) {
        console.error("Error updating balance:", error)
        setUser(user)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
