"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-client"
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react"
import { format } from "date-fns"

interface TrendData {
  current: number
  previous: number
  average: number
}

interface SpendingTrendsProps {
  dateRange: {
    from: Date
    to: Date
  }
}

export default function SpendingTrends({ dateRange }: SpendingTrendsProps) {
  const [data, setData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { from, to } = dateRange
      const startOfPeriod = format(from, 'yyyy-MM-dd')
      const endOfPeriod = format(to, 'yyyy-MM-dd')

      // Previous Period
      const duration = to.getTime() - from.getTime()
      const prevToDate = new Date(from.getTime() - 86400000)
      const prevFromDate = new Date(prevToDate.getTime() - duration)

      const startOfLastPeriod = format(prevFromDate, 'yyyy-MM-dd')
      const endOfLastPeriod = format(prevToDate, 'yyyy-MM-dd')

      // Fetch Current Period
      const { data: currentExp } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", startOfPeriod)
        .lte("date", endOfPeriod)

      // Fetch Previous Period
      const { data: prevExp } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", startOfLastPeriod)
        .lte("date", endOfLastPeriod)

      if (currentExp && prevExp) {
        const currentTotal = currentExp.reduce((sum, e) => sum + e.amount, 0)
        const prevTotal = prevExp.reduce((sum, e) => sum + e.amount, 0)

        // Calculate days in period for average
        // Ensure at least 1 day to avoid divide by zero
        const daysDiff = Math.max(1, Math.ceil(duration / (1000 * 3600 * 24)) + 1)
        const average = currentTotal / daysDiff

        setData({
          current: currentTotal,
          previous: prevTotal,
          average
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Spinner /></div>
  }

  if (!data || data.current === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
        <h3 className="text-lg font-semibold mb-2">Am I improving?</h3>
        <p className="text-muted-foreground">Trends will appear once you track expenses over time.</p>
      </Card>
    )
  }

  const diff = data.current - data.previous
  const percentage = data.previous > 0 ? (diff / data.previous) * 100 : 0
  const isBetter = diff < 0 // Spending less is usually "better"

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold tracking-tight">Am I improving?</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Comparison */}
        <div className="p-5 rounded-xl bg-muted/30 border border-primary/5">
          <p className="text-sm font-medium text-muted-foreground mb-1 capitalize">Total Spent (Selected Period)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">₹{data.current.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {isBetter ? <TrendingDown className="w-5 h-5 text-green-500" /> : <TrendingUp className="w-5 h-5 text-red-500" />}
            <span className={`font-medium ${isBetter ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(percentage).toFixed(0)}% {isBetter ? "less" : "more"}
            </span>
            <span className="text-muted-foreground text-sm">than previous period</span>
          </div>
        </div>

        {/* Average */}
        <div className="p-5 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{data.average.toFixed(0)}</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Average spent per day in this period</p>
        </div>
      </div>
    </Card>
  )
}
