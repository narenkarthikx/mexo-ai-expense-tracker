"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-client"
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"

interface TrendData {
  thisWeek: number
  lastWeek: number
  thisMonth: number
  lastMonth: number
  dailyAverage: number
  topSpendingDay: { date: string; amount: number }
}

export default function SpendingTrends() {
  const [data, setData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSpendingTrends()
  }, [])

  const fetchSpendingTrends = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      const startOfThisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const startOfLastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
      const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, date, category")
        .eq("user_id", user.id)
        .gte("date", startOfLastMonth.toISOString().split("T")[0])

      if (expenses) {
        const thisWeekExp = expenses.filter(e => new Date(e.date) >= startOfThisWeek)
        const lastWeekExp = expenses.filter(e => 
          new Date(e.date) >= startOfLastWeek && new Date(e.date) < startOfThisWeek
        )
        const thisMonthExp = expenses.filter(e => new Date(e.date) >= startOfThisMonth)
        const lastMonthExp = expenses.filter(e => 
          new Date(e.date) >= startOfLastMonth && new Date(e.date) < startOfThisMonth
        )

        const thisWeek = thisWeekExp.reduce((sum, e) => sum + e.amount, 0)
        const lastWeek = lastWeekExp.reduce((sum, e) => sum + e.amount, 0)
        const thisMonth = thisMonthExp.reduce((sum, e) => sum + e.amount, 0)
        const lastMonth = lastMonthExp.reduce((sum, e) => sum + e.amount, 0)

        // Daily breakdown
        const dailyTotals: { [key: string]: number } = {}
        thisMonthExp.forEach(e => {
          dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount
        })

        const topDay = Object.entries(dailyTotals)
          .sort(([,a], [,b]) => b - a)[0]

        setData({
          thisWeek,
          lastWeek,
          thisMonth,
          lastMonth,
          dailyAverage: thisMonth / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
          topSpendingDay: topDay 
            ? { date: topDay[0], amount: topDay[1] }
            : { date: '', amount: 0 }
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Card>
    )
  }

  if (!data || data.thisMonth === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending Trends</h3>
        <p className="text-center text-muted-foreground py-8">No spending data available</p>
      </Card>
    )
  }

  const weekChange = ((data.thisWeek - data.lastWeek) / (data.lastWeek || 1)) * 100
  const monthChange = ((data.thisMonth - data.lastMonth) / (data.lastMonth || 1)) * 100

  return (
    <Card className="p-5 bg-gradient-to-br from-card to-muted/10">
      <h3 className="text-lg font-semibold mb-4">Spending Trends</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* This Week vs Last Week */}
        <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">This Week</span>
          </div>
          <p className="text-2xl font-bold">₹{data.thisWeek.toFixed(0)}</p>
          <div className="flex items-center gap-1">
            {weekChange >= 0 ? (
              <TrendingUp className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-green-500" />
            )}
            <span className={`text-xs font-medium ${weekChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {Math.abs(weekChange).toFixed(0)}% vs last week
            </span>
          </div>
        </div>

        {/* This Month vs Last Month */}
        <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold">₹{data.thisMonth.toFixed(0)}</p>
          <div className="flex items-center gap-1">
            {monthChange >= 0 ? (
              <TrendingUp className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-green-500" />
            )}
            <span className={`text-xs font-medium ${monthChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {Math.abs(monthChange).toFixed(0)}% vs last month
            </span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-muted-foreground">Daily Average</span>
          </div>
          <p className="text-2xl font-bold">₹{data.dailyAverage.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Per day this month</p>
        </div>

        {/* Top Spending Day */}
        {data.topSpendingDay.date && (
          <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-muted-foreground">Highest Day</span>
            </div>
            <p className="text-2xl font-bold">₹{data.topSpendingDay.amount.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(data.topSpendingDay.date).toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
