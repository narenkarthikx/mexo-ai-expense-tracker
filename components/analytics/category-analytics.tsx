"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase-client"

interface CategoryData {
  category: string
  amount: number
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
        .select("amount, extracted_data")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])

      if (!error && expenses) {
        const categoryTotals: Record<string, number> = {}

        expenses.forEach((exp: any) => {
          const category = exp.extracted_data?.category || "Other"
          categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount
        })

        const chartData = Object.entries(categoryTotals)
          .map(([category, amount]) => ({
            category,
            amount: Math.round(amount * 100) / 100,
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
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No expense data available</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Amount Spent" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
