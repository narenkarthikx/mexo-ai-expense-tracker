"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { createClient } from "@/lib/supabase-client"

const COLORS = ["#06b6d4", "#ec4899", "#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#3b82f6"]

interface PieDataItem {
  name: string
  value: number
  [key: string]: any
}

interface BarDataItem {
  category: string
  budget: number
  spent: number
  remaining: number
  [key: string]: any
}

interface Budget {
  id: string
  user_id: string
  category: string
  limit: number
  created_at?: string
}

interface Expense {
  id: string
  user_id: string
  category: string
  amount: number
  description?: string
  created_at?: string
}

export default function BudgetCharts() {
  const [pieData, setPieData] = useState<PieDataItem[]>([])
  const [barData, setBarData] = useState<BarDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBudgetData()
  }, [])

  const fetchBudgetData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: budgets } = await supabase.from("budgets").select("*").eq("user_id", user.id)

      const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", user.id)

      if (budgets) {
        const pieChartData: PieDataItem[] = budgets.map((b: Budget) => ({
          name: b.category,
          value: b.limit,
        }))
        setPieData(pieChartData)

        const barChartData: BarDataItem[] = budgets.map((b: Budget) => {
          const spent =
            expenses?.reduce((acc: number, exp: Expense) => {
              if (exp.category === b.category) {
                return acc + exp.amount
              }
              return acc
            }, 0) || 0

          return {
            category: b.category,
            budget: b.limit,
            spent,
            remaining: Math.max(0, b.limit - spent),
          }
        })
        setBarData(barChartData)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Spinner />
      </Card>
    )
  }

  if (pieData.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-card to-card/50">
        <p className="text-muted-foreground">Create budgets to see visualizations</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <h3 className="text-lg font-bold mb-4">Budget Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
              {pieData.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `₹${value.toFixed(0)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <h3 className="text-lg font-bold mb-4">Budget vs Spent</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="category" style={{ fontSize: "12px" }} />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip formatter={(value: any) => `₹${value.toFixed(0)}`} />
            <Bar dataKey="budget" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            <Bar dataKey="spent" fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
