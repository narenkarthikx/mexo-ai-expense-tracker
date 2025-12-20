"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Landmark,
  Loader,
  ScanLine,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Menu,
  X
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section')
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Landmark className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mexo</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
            <Button onClick={scrollToAuth} size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b p-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
            <a href="#features" className="block text-sm font-medium p-2 hover:bg-muted rounded text-center" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm font-medium p-2 hover:bg-muted rounded text-center" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <Button onClick={scrollToAuth} className="w-full">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 pt-12 pb-20 md:pt-24 md:pb-32 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Finance
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Track Expenses <br />
                <span className="text-primary">Without The Effort</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Stop manual data entry. Mexo uses advanced AI to scan receipts, categorize transactions, and provide actionable insights instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={scrollToAuth} className="w-full sm:w-auto px-8 h-12 text-base">
                Start for Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base">
                View Demo
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Right Content - Auth Card */}
          <div id="auth-section" className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform rotate-12 scale-75 opacity-50"></div>
            <Card className="relative w-full max-w-md p-6 md:p-8 shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">
                  {isSignup ? "Create your account" : "Welcome back"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSignup ? "Start tracking in seconds" : "Login to access your dashboard"}
                </p>
              </div>

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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to manage money</h2>
            <p className="text-muted-foreground text-lg">
              Mexo combines powerful features with a simple, intuitive interface to make financial tracking a breeze.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Receipt Scanning</h3>
              <p className="text-muted-foreground">
                Simply take a photo of your receipt. Our AI instantly extracts merchant, date, total, and items with 99% accuracy.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Get visual insights into your spending habits. See exactly where your money goes with interactive charts and graphs.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Categorization</h3>
              <p className="text-muted-foreground">
                Transactions are automatically categorized. Teach Mexo your preferences once, and it remembers forever.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-3xl font-bold tracking-tight">Simple workflow, powerful results</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Snap a photo</h4>
                    <p className="text-muted-foreground">Take a picture of your receipt or upload a digital invoice directly from your phone.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">AI Processing</h4>
                    <p className="text-muted-foreground">We extract all data, categorize the expense, and link it to the merchant automatically.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Gain Insights</h4>
                    <p className="text-muted-foreground">View your spending trends, track budgets, and save money with smart analytics.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-muted rounded-2xl p-8 border border-border/50 shadow-inner">
              {/* Decorative placeholder for app screenshot */}
              <div className="aspect-[4/3] bg-background rounded-lg border shadow-sm p-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent"></div>
                <div className="text-center space-y-2 relative z-10">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center text-primary">
                    <ScanLine className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-foreground">Processing Receipt...</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-primary">
                    <Loader className="w-3 h-3 animate-spin" />
                    <span>Analyzing items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Footer */}
      <footer className="py-12 border-t bg-card text-card-foreground">
        <div className="container mx-auto px-4 text-center">

          {/* Developer Credit */}
          <div className="flex justify-center mb-8">
            <a
              href="https://github.com/narenkarthikx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_-12px_rgba(var(--primary),0.5)] group text-left decoration-0 hover:shadow-primary/20"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <span className="text-primary font-mono text-lg font-bold">&gt;_</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase leading-tight">Developer</span>
                <span className="font-mono font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                  narenkarthik<span className="text-primary">x</span>
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Landmark className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">Mexo</span>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">
            © {new Date().getFullYear()} Mexo Expense Tracker. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
