"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ExpenseOverviewEnhanced from "@/components/dashboard/expense-overview-enhanced"
import RecentExpenses from "@/components/dashboard/recent-expenses"
import QuickAddExpense from "@/components/dashboard/quick-add-expense"
import ExpenseInsights from "@/components/dashboard/expense-insights"
import SmartSuggestions from "@/components/dashboard/smart-suggestions"
import { Loader, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to home
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          <div>
    
            <p className="text-sm text-muted-foreground">Your financial overview at a glance</p>
          </div>
        </div>

        {/* Quick Add - Priority Action */}
        <QuickAddExpense />

        {/* Main Overview - Single Column for Better Focus */}
        <ExpenseOverviewEnhanced />

        {/* Two Column Layout for Supporting Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentExpenses />
          <ExpenseInsights />
        </div>

        {/* Smart Suggestions at Bottom */}
        <SmartSuggestions />
      </div>
    </DashboardLayout>
  )
}
