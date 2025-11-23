"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase-client"
import { Loader, Eye, EyeOff } from "lucide-react"

export default function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all fields")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      const supabase = createClient()
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data?.user && !data?.session) {
        setError("Please check your email for verification before signing in.")
        return
      }

      // If we have a session, the user is automatically signed in
      // The auth provider will handle the redirect
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Full Name</label>
        <Input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="h-11 bg-input border-border hover:border-primary/50 transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Email Address</label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-11 bg-input border-border hover:border-primary/50 transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-11 bg-input border-border pr-10 hover:border-primary/50 transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Confirm Password</label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="h-11 bg-input border-border pr-10 hover:border-primary/50 transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
        {loading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
