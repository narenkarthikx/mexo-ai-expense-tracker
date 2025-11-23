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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Financial Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Analyze spending patterns and trends</p>
        </div>
        <PDFExport />
      </div>
      <MonthlyOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryAnalytics />
        <SpendingTrends />
      </div>
    </div>
  )
}
