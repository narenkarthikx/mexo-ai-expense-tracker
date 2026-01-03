"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MonthlyOverview from "@/components/analytics/monthly-overview"
import CategoryAnalytics from "@/components/analytics/category-analytics"
import SpendingTrends from "@/components/analytics/spending-trends"
import { BarChart3 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { startOfMonth, endOfMonth, setMonth, setYear } from "date-fns"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

  // Generate Year Options (Current Year - 5 to Current Year + 1)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleMonthChange = (monthIndex: string) => {
    setSelectedDate(prev => setMonth(prev, parseInt(monthIndex)))
  }

  const handleYearChange = (yearStr: string) => {
    setSelectedDate(prev => setYear(prev, parseInt(yearStr)))
  }

  // Derive dateRange for children components
  // This allows them to reuse their "custom date range" logic effortlessly
  const dateRange = {
    from: startOfMonth(selectedDate),
    to: endOfMonth(selectedDate)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">Insights into your spending patterns</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Month Select */}
          <Select
            value={selectedDate.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Select */}
          <Select
            value={selectedDate.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Components receiving the calculated dateRange prop */}
      <MonthlyOverview dateRange={dateRange} />
      <CategoryAnalytics dateRange={dateRange} />
      <SpendingTrends dateRange={dateRange} />
    </div>
  )
}
