"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-client"

interface MonthlyData {
  date: string
  amount: number
}

export default function MonthlyOverview() {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [budgetLimit, setBudgetLimit] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    fetchMonthlyData()
  }, [])

  const fetchMonthlyData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // Fetch expenses
      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("amount, date")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])
        .order("date", { ascending: true })

      // Fetch total budget limit
      const { data: budgets } = await supabase
        .from("budgets")
        .select("limit")
        .eq("user_id", user.id)

      // Calculate total budget
      const totalBudget = budgets?.reduce((sum, b) => sum + (b.limit || 0), 0) || 0
      setBudgetLimit(totalBudget)

      if (!error && expenses) {
        // Group by date and calculate cumulative sum
        const groupedData: Record<string, number> = {}
        let runningTotal = 0

        expenses.forEach((exp: any) => {
          runningTotal += exp.amount
          groupedData[exp.date] = runningTotal
        })

        const chartData = Object.entries(groupedData).map(([date, amount]) => ({
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          amount: amount as number,
        }))

        setData(chartData)
        setTotalSpent(runningTotal)
      }
    } finally {
      setLoading(false)
    }
  }

  const remaining = budgetLimit - totalSpent

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
        <p className="text-3xl font-bold">₹{totalSpent.toFixed(0)}</p>
        <p className="text-xs text-muted-foreground mt-2">This month</p>
      </Card>
      <Card className="p-6">
        <p className="text-sm text-muted-foreground mb-2">Budget Limit</p>
        <p className="text-3xl font-bold">₹{budgetLimit.toFixed(0)}</p>
        <p className="text-xs text-muted-foreground mt-2">Monthly budget</p>
      </Card>
      <Card className="p-6">
        <p className="text-sm text-muted-foreground mb-2">Remaining</p>
        <p className={`text-3xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
          ₹{Math.abs(remaining).toFixed(0)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">{remaining >= 0 ? "Available" : "Over budget"}</p>
      </Card>
    </div>
  )
}
