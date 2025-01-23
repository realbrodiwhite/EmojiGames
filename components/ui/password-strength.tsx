import { useState, useEffect } from "react"
import { Progress } from "./progress"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0
      if (password.length > 8) score++
      if (password.length > 12) score++
      if (/[A-Z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      return (score / 5) * 100
    }

    setStrength(calculateStrength())
  }, [password])

  return (
    <div className="mt-2">
      <Progress value={strength} className="w-full" />
      <p className="text-sm mt-1" aria-live="polite">
        Password strength:
        {strength < 40 && "Weak"}
        {strength >= 40 && strength < 70 && "Medium"}
        {strength >= 70 && "Strong"}
      </p>
    </div>
  )
}

