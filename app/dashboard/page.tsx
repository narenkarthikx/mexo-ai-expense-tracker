"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ExpenseOverviewEnhanced from "@/components/dashboard/expense-overview-enhanced"
import RecentExpenses from "@/components/dashboard/recent-expenses"
import QuickAddExpense from "@/components/dashboard/quick-add-expense"
import { Loader } from "lucide-react"

import { format } from "date-fns"

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
      <div className="space-y-6 max-w-4xl mx-auto pb-20">

        {/* Date Header (Compact) */}
        <div className="px-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {format(new Date(), "MMMM d, EEEE")}
          </p>
        </div>

        {/* 1. Primary Action */}
        <QuickAddExpense />

        {/* 2. Spending Summary (+ AI Insight included inside or below) */}
        <ExpenseOverviewEnhanced />

        {/* 3. Recent Expenses List */}
        <RecentExpenses />

      </div>
    </DashboardLayout>
  )
}
