"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
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

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
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

          return { id: b.id, category: b.category, limit: b.limit, spent }
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
          period: "monthly",
        },
      ])

      if (!error) {
        setSelectedCategory("")
        setBudgetLimit("")
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
      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Create New Budget
        </h3>
        <form onSubmit={handleAddBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Select Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-4 rounded-xl text-center transition-all border-2 ${
                    selectedCategory === cat.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Monthly Budget Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                step="0.01"
                className="pl-7 h-11 bg-input border-border"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
            disabled={!selectedCategory || !budgetLimit}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {budgets.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold text-foreground">No budgets set yet</p>
            <p className="text-muted-foreground mt-1">Create your first budget to start tracking</p>
          </Card>
        ) : (
          budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const isExceeded = percentage > 100
            const isWarning = percentage > 75

            return (
              <Card
                key={budget.id}
                className="p-5 bg-gradient-to-r from-card to-card/50 border-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-foreground">{budget.category}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-semibold text-primary">${budget.spent.toFixed(2)}</span>
                      <span> of </span>
                      <span className="font-semibold">${budget.limit.toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full overflow-hidden h-2.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isExceeded ? "bg-destructive" : isWarning ? "bg-accent" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{Math.round(percentage)}%</span>
                    {isExceeded && <span className="text-destructive font-semibold">Budget Exceeded!</span>}
                    {isWarning && !isExceeded && <span className="text-accent font-semibold">Approaching limit</span>}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
