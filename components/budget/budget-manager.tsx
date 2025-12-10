"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader, TrendingUp, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period?: string
}

const CATEGORIES = [
  { name: "Groceries", icon: "🛒" },
  { name: "Food & Dining", icon: "🍽️" },
  { name: "Utilities", icon: "💡" },
  { name: "Housing", icon: "🏠" },
  { name: "Transport", icon: "🚗" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Health", icon: "⚕️" },
]

const BUDGET_PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState("monthly")
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

      const { data: budgets } = await supabase.from("budgets").select("*").eq("user_id", user.id)

      const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", user.id)

      if (budgets) {
        const budgetsWithSpent = budgets.map((b: any) => {
          const spent =
            expenses?.reduce((acc: number, exp: any) => {
              if (exp.category === b.category) {
                return acc + exp.amount
              }
              return acc
            }, 0) || 0

          return { id: b.id, category: b.category, limit: b.limit, spent, period: b.period || 'monthly' }
        })
        setBudgets(budgetsWithSpent)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !budgetLimit) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("budgets").insert([
        {
          user_id: user.id,
          category: selectedCategory,
          limit: Number.parseFloat(budgetLimit),
          period: budgetPeriod,
        },
      ])

      if (!error) {
        setSelectedCategory("")
        setBudgetLimit("")
        setBudgetPeriod("monthly")
        await fetchBudgets()
      }
    } catch (err) {
      console.error("Error adding budget:", err)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Delete this budget?")) return

    const { error } = await supabase.from("budgets").delete().eq("id", id)

    if (!error) {
      setBudgets(budgets.filter((b) => b.id !== id))
    }
  }

  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Budget List - Show existing budgets first */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Budget Limits</h3>
        {budgets.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10">
            <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium text-foreground">No budgets created yet</p>
            <p className="text-sm text-muted-foreground mt-1">Set your first budget limit below</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100
              const isExceeded = percentage > 100
              const isWarning = percentage > 75 && !isExceeded
              const remaining = budget.limit - budget.spent

              return (
                <Card
                  key={budget.id}
                  className={`p-4 transition-all group relative overflow-hidden ${
                    isExceeded 
                      ? 'border-destructive/50 bg-destructive/5' 
                      : isWarning 
                      ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20' 
                      : 'border-primary/20 bg-gradient-to-br from-card to-muted/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{budget.category}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground capitalize">{budget.period || 'Monthly'} Budget</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-destructive hover:bg-destructive/10 rounded transition-all"
                      title="Delete budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-primary">₹{budget.spent.toFixed(0)}</span>
                      <span className="text-sm text-muted-foreground">/ ₹{budget.limit.toFixed(0)}</span>
                    </div>

                    <div className="w-full bg-muted/50 rounded-full overflow-hidden h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isExceeded ? "bg-destructive" : isWarning ? "bg-yellow-500" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        isExceeded ? 'text-destructive' : isWarning ? 'text-yellow-600 dark:text-yellow-500' : 'text-muted-foreground'
                      }`}>
                        {Math.round(percentage)}% used
                      </span>
                      <span className={`text-xs font-medium ${
                        remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                      }`}>
                        {remaining >= 0 ? `₹${remaining.toFixed(0)} left` : `₹${Math.abs(remaining).toFixed(0)} over`}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add New Budget - Secondary action */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Budget
        </h3>
        <form onSubmit={handleAddBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3 rounded-lg text-center transition-all border ${
                    selectedCategory === cat.name
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="text-xl mb-0.5">{cat.icon}</div>
                  <div className="text-[10px] font-medium leading-tight">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                <Input
                  type="number"
                  placeholder="5000"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  step="100"
                  className="pl-7 h-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_PERIODS.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full h-10"
                disabled={!selectedCategory || !budgetLimit}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
