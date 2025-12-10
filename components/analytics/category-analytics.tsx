"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-client"
import { ShoppingCart, Utensils, Car, ShoppingBag, Heart, Popcorn, Zap, Plane, Fuel, MoreHorizontal } from "lucide-react"

interface CategoryData {
  category: string
  amount: number
  percentage: number
  count: number
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

export default function CategoryAnalytics() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCategoryData()
  }, [])

  const fetchCategoryData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("amount, category")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])

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
            percentage: Math.round((data.amount / total) * 100),
            count: data.count,
          }))
          .sort((a, b) => b.amount - a.amount)

        setData(chartData)
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

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <p className="text-center text-muted-foreground py-8">No expense data for this month</p>
      </Card>
    )
  }

  const topCategories = data.slice(0, 5)

  return (
    <Card className="p-5 bg-gradient-to-br from-card to-muted/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <Badge variant="outline" className="text-xs">{data.length} Categories</Badge>
      </div>
      
      <div className="space-y-4">
        {topCategories.map((item, index) => {
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
      
      {data.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            +{data.length - 5} more categories
          </p>
        </div>
      )}
    </Card>
  )
}
