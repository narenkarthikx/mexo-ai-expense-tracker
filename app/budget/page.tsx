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
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <PiggyBank className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
            <p className="text-sm text-muted-foreground">Set spending limits and monitor your budget health</p>
          </div>
        </div>

        {/* Budget Manager - Primary Action */}
        <BudgetManager />
      </div>
    </DashboardLayout>
  )
}
