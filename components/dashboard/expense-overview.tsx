"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase-client"
import { Loader } from "lucide-react"

const COLORS = ["#0891b2", "#ec4899", "#f59e0b", "#8b5cf6", "#ef4444", "#10b981", "#3b82f6", "#6b7280"]

export default function ExpenseOverview() {
  const [data, setData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchExpenseData()
  }, [])

  const fetchExpenseData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })

      if (expenses) {
        // Group by month for bar chart
        const monthlyData: any = {}
        expenses.forEach((exp: any) => {
          const date = new Date(exp.date)
          const month = date.toLocaleString("default", { month: "short" })
          monthlyData[month] = (monthlyData[month] || 0) + exp.amount
        })

        const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
          name: month,
          amount: amount,
        }))

        setData(chartData)

        // Group by category for pie chart
        const categoryBreakdown: any = {}
        expenses.forEach((exp: any) => {
          const cat = exp.category || "Other"
          categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + exp.amount
        })

        const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
          name,
          value,
        }))

        setCategoryData(pieData)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center h-80">
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50">
      <h3 className="text-xl font-bold mb-6">Spending Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="name" stroke="currentColor" style={{ fontSize: "12px" }} />
          <YAxis stroke="currentColor" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value: any) => `$${value.toFixed(2)}`}
          />
          <Bar dataKey="amount" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
