"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trash2, Loader } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: string
}

const CATEGORY_ICONS: { [key: string]: string } = {
  Groceries: "🛒",
  "Food & Dining": "🍽️",
  Utilities: "💡",
  Housing: "🏠",
  Transport: "🚗",
  Entertainment: "🎬",
  Health: "⚕️",
  Other: "📌",
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (!error && data) {
        setExpenses(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return

    const { error } = await supabase.from("expenses").delete().eq("id", id)

    if (!error) {
      setExpenses(expenses.filter((e) => e.id !== id))
    }
  }

  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </Card>
    )
  }

  if (expenses.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">No expenses yet</p>
          <p className="text-muted-foreground">Start adding expenses to see them here</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          className="p-4 hover:shadow-md transition-all bg-gradient-to-r from-card to-card/50 border-primary/5 hover:border-primary/20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="text-2xl">{CATEGORY_ICONS[expense.category] || "📌"}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <p className="text-xl font-bold text-primary tabular-nums">-${expense.amount.toFixed(2)}</p>
              <button
                onClick={() => handleDelete(expense.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
