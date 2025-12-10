"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import MonthlyOverview from "@/components/analytics/monthly-overview"
import CategoryAnalytics from "@/components/analytics/category-analytics"
import SpendingTrends from "@/components/analytics/spending-trends"
import PDFExport from "@/components/analytics/pdf-export"
import { BarChart3 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">Insights into your spending patterns</p>
          </div>
        </div>
        <PDFExport />
      </div>

      {/* Monthly Overview - Primary Section */}
      <MonthlyOverview />

      {/* Category & Trends */}
      <CategoryAnalytics />
      
      <SpendingTrends />
    </div>
  )
}
