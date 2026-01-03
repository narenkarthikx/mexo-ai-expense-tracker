"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import BudgetManager from "@/components/budget/budget-manager"
import { PiggyBank } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function BudgetPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <Spinner />
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
          <div className="p-2 bg-primary/10 rounded-xl">
            <PiggyBank className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Budget Planning</h1>
            <p className="text-sm text-muted-foreground">Set spending limits and stay in control of your finances.</p>
          </div>
        </div>

        {/* Budget Manager Component */}
        <BudgetManager />
      </div>
    </DashboardLayout>
  )
}
