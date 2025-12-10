"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, Trash2, TrendingUp, ShoppingCart, Utensils, Car, ShoppingBag, Heart, Popcorn, Zap, Plane, Fuel, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import Link from "next/link"

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

const CATEGORY_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Groceries: ShoppingCart,
  Dining: Utensils,
  "Food & Dining": Utensils,
  Transportation: Car,
  Transport: Car,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Health: Heart,
  Entertainment: Popcorn,
  Utilities: Zap,
  Travel: Plane,
  Gas: Fuel,
  Other: MoreHorizontal,
}

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRecentExpenses()
  }, [])

  const fetchRecentExpenses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(8)

      if (data) {
        setExpenses(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id)
    if (!error) {
      setExpenses(expenses.filter((e) => e.id !== id))
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
    <Card className="p-4 bg-gradient-to-br from-card to-muted/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Recent Expenses
        </h3>
        <Link href="/expenses">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 text-xs h-7 px-2">
            View All →
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No expenses yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your first expense to get started</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-background/50 hover:bg-muted/50 rounded-lg transition-all group border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  {(() => {
                    const Icon = CATEGORY_ICONS[expense.category] || MoreHorizontal
                    return <Icon className="w-4 h-4 text-primary" />
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{expense.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {typeof window !== 'undefined' 
                        ? new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : expense.date
                      }
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{expense.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <p className="font-bold text-sm text-primary tabular-nums">₹{expense.amount.toFixed(0)}</p>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-destructive hover:bg-destructive/10 rounded transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
