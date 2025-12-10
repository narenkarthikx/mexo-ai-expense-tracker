"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase-client"
import { Loader, Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      // No need to manually redirect - the auth provider will handle this
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-3.5">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="w-4 h-4" />
          </div>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="h-10 pl-10 bg-gradient-to-br from-background to-muted/30 border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="w-4 h-4" />
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-10 pl-10 pr-10 bg-gradient-to-br from-background to-muted/30 border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 bg-gradient-to-r from-destructive/10 to-red-50 border border-destructive/30 rounded-lg text-xs text-destructive flex items-start gap-2">
          <span className="text-destructive font-bold">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-10 font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/20 transition-all" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
