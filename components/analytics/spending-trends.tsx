"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { createClient } from "@/lib/supabase-client"

interface PieData {
  name: string
  value: number
  [key: string]: any
}

export default function SpendingTrends() {
  const [data, setData] = useState<PieData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

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
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("amount, extracted_data")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])

      if (!error && expenses) {
        const categoryTotals: Record<string, number> = {}
        let total = 0

        expenses.forEach((exp: any) => {
          const category = exp.extracted_data?.category || "Other"
          categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount
          total += exp.amount
        })

        const pieData = Object.entries(categoryTotals)
          .map(([name, value]) => ({
            name,
            value: Math.round((value / total) * 100),
          }))
          .sort((a, b) => b.value - a.value)

        setData(pieData)
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
        <p className="text-center text-muted-foreground">No spending data available</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Spending Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
