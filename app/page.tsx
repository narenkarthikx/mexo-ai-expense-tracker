"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"
import { Card } from "@/components/ui/card"
import { Landmark, Loader } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSignup, setIsSignup] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center p-4">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Landmark className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ExpenseAI
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Smart expense tracking with AI-powered receipt scanning
            </p>
          </div>
        </div>

        {/* Auth Form Card */}
        <Card className="p-8 shadow-lg border-primary/10 bg-card/50 backdrop-blur">
          {isSignup ? (
            <>
              <SignupForm />
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm />
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">Secure • Privacy-first • AI-powered</p>
      </div>
    </div>
  )
}
