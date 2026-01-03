"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-client"
import { ShoppingCart, Utensils, Car, ShoppingBag, Heart, Popcorn, Zap, Plane, Fuel, MoreHorizontal, Info } from "lucide-react"
import { format } from "date-fns"

interface CategoryData {
  category: string
  amount: number
  percentage: number
  count: number
}

interface CategoryAnalyticsProps {
  dateRange: {
    from: Date
    to: Date
  }
}

const CATEGORY_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Groceries: ShoppingCart,
  Dining: Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Entertainment: Popcorn,
  Utilities: Zap,
  Travel: Plane,
  Gas: Fuel,
  Other: MoreHorizontal,
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Groceries: "bg-blue-500",
  Dining: "bg-orange-500",
  Transportation: "bg-green-500",
  Shopping: "bg-purple-500",
  Healthcare: "bg-red-500",
  Entertainment: "bg-pink-500",
  Utilities: "bg-yellow-500",
  Travel: "bg-indigo-500",
  Gas: "bg-teal-500",
  Other: "bg-gray-500",
}

export default function CategoryAnalytics({ dateRange }: CategoryAnalyticsProps) {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCategoryData()
  }, [dateRange])

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { from, to } = dateRange
      const startDate = format(from, 'yyyy-MM-dd')
      const endDate = format(to, 'yyyy-MM-dd')

      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("amount, category")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate)

      if (!error && expenses) {
        const categoryTotals: Record<string, { amount: number; count: number }> = {}

        expenses.forEach((exp: any) => {
          const category = exp.category || "Other"
          if (!categoryTotals[category]) {
            categoryTotals[category] = { amount: 0, count: 0 }
          }
          categoryTotals[category].amount += exp.amount
          categoryTotals[category].count += 1
        })

        const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0)

        const chartData = Object.entries(categoryTotals)
          .map(([category, data]) => ({
            category,
            amount: Math.round(data.amount * 100) / 100,
            percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
            count: data.count,
          }))
          .sort((a, b) => b.amount - a.amount)

        setData(chartData)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Card className="p-6"><div className="flex justify-center"><Spinner /></div></Card>

  if (data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Where is my money going?</h3>
        <p className="text-muted-foreground">No data for this period yet.</p>
      </Card>
    )
  }

  const topCategories = data.slice(0, 5)
  const topCategory = data[0]

  return (
    <Card className="p-5 bg-gradient-to-br from-card to-muted/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold tracking-tight">Where is my money going?</h3>
      </div>

      <div className="space-y-5">
        {topCategories.map((item) => {
          const Icon = CATEGORY_ICONS[item.category] || MoreHorizontal
          const colorClass = CATEGORY_COLORS[item.category] || "bg-gray-500"

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${colorClass}/10`}>
                    <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{item.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{item.amount.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex gap-3 items-start bg-muted/20 p-3 rounded-lg">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/80">
            In this period, your highest spending is on <span className="font-semibold text-foreground">{topCategory.category}</span>, accounting for {topCategory.percentage}% of your expenses.
          </p>
        </div>
      </div>
    </Card>
  )
}
