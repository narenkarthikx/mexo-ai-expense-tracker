"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase-client"
import { Loader, AlertCircle, PiggyBank } from "lucide-react"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
}

export default function BudgetStatus() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from("budgets").select("*").eq("user_id", user.id)

      if (data) {
        // Calculate spent amount for each budget
        const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", user.id)

        const budgetsWithSpent = data.map((budget: any) => {
          const spent =
            expenses?.reduce((acc: number, exp: any) => {
              if (exp.category === budget.category) {
                return acc + exp.amount
              }
              return acc
            }, 0) || 0

          return { ...budget, spent }
        })

        setBudgets(budgetsWithSpent)
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
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <PiggyBank className="w-5 h-5 text-primary" />
        Budget Status
      </h3>

      {budgets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No budgets set</p>
        </div>
      ) : (
        <div className="space-y-5">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const isExceeded = percentage > 100
            const isWarning = percentage > 75

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {budget.category}
                    {isExceeded && <AlertCircle className="w-4 h-4 text-destructive" />}
                    {isWarning && !isExceeded && <AlertCircle className="w-4 h-4 text-accent" />}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </p>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2.5"
                  style={{
                    backgroundColor: isExceeded ? "rgba(239, 68, 68, 0.1)" : "rgba(96, 165, 250, 0.1)",
                  }}
                />
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isExceeded ? "bg-destructive" : isWarning ? "bg-accent" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
