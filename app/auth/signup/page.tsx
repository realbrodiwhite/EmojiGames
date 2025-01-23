"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "'components/ui/button'"
import { Input } from "'components/ui/input'"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "'components/ui/card'"
import { Label } from "'components/ui/label'"
import Link from "next/link"
import { useAuth } from "'lib/auth-context'"
import { PasswordStrength } from "'components/ui/password-strength'"
import { useToast } from "'components/ui/use-toast'"
import { uploadImage } from "'lib/blob'" // Importing the uploadImage function

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null) // State for the profile picture
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }
    try {
      let imageUrl = null;
      if (profilePicture) {
        imageUrl = await uploadImage('user-avatars', username, profilePicture); // Uploading the image
      }
      await signUp(username, email, password, imageUrl); // Pass the image URL to signUp
      toast({
        title: "Success",
        description: "Account created successfully. Redirecting to home...",
      })
      router.push("/")
    } catch (error) {
      console.error("Sign up failed:", error)
      toast({
        title: "Error",
        description: "Sign up failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to play Emoji Slots.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={password} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Sign Up</Button>
            <Button asChild variant="ghost">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
