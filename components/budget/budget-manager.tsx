"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Budget {
  id: string
  category: string
  limit_amount: number // Updated to match DB Schema
  spent: number
  period?: string
}

const DEFAULT_CATEGORIES = [
  "Groceries", "Dining", "Transportation", "Shopping", "Healthcare",
  "Entertainment", "Utilities", "Travel", "Gas", "Other"
]

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [criticalError, setCriticalError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadCategories()
    fetchBudgets()
  }, [])

  async function loadCategories() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_categories')
        .select('categories')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data?.categories) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.log('Using default categories', error)
    }
  }

  const fetchBudgets = async () => {
    setCriticalError(null)
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get Start of Current Month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

      // Fetch Budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)

      // Fetch Expenses (CURRENT MONTH ONLY)
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("amount, category")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)

      if (budgetsError) {
        throw new Error(`DB Error: ${budgetsError.message} (${budgetsError.code})`)
      }

      if (budgets) {
        const budgetsWithSpent = budgets.map((b: any) => {
          const categoryName = b.category || "Unknown"

          const spent = expenses?.reduce((acc: number, exp: any) => {
            if (exp.category === categoryName) {
              return acc + exp.amount
            }
            return acc
          }, 0) || 0

          return {
            id: b.id,
            category: categoryName,
            limit_amount: b.limit_amount,
            spent,
            period: b.period || 'monthly'
          }
        })
        setBudgets(budgetsWithSpent)
      }
    } catch (e: any) {
      console.error("Budget Fetch Error", e)
      setCriticalError(e.message)
      toast.error("Failed to load budgets")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !budgetLimit) return

    const limit = Number.parseFloat(budgetLimit)
    if (isNaN(limit) || limit <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Check for existing budget (String Match)
      const { data: existing, error: fetchErr } = await supabase
        .from("budgets")
        .select("id")
        .eq("user_id", user.id)
        .eq("category", selectedCategory)

      if (fetchErr) {
        console.warn("Check Existing failed:", fetchErr)
      }

      let operationError

      if (existing && existing.length > 0) {
        // UPDATE Existing
        const { error } = await supabase
          .from("budgets")
          .update({ limit_amount: limit }) // Correct column
          .eq("id", existing[0].id)
        operationError = error
        if (!error) toast.success(`Updated budget for ${selectedCategory}`)
      } else {
        // INSERT New
        const { error } = await supabase
          .from("budgets")
          .insert([{
            user_id: user.id,
            category: selectedCategory, // String
            limit_amount: limit, // Correct column
          }])
        operationError = error
        if (!error) toast.success(`Created budget for ${selectedCategory}`)
      }

      if (operationError) {
        throw new Error(operationError.message)
      } else {
        // Success
        setSelectedCategory("")
        setBudgetLimit("")
        setIsDialogOpen(false)
        await fetchBudgets()
      }

    } catch (err: any) {
      console.error("Save Error:", err)

      // Better Error Messages for Users
      let msg = err.message
      if (msg.includes("limit_amount")) msg = "Database column 'limit_amount' missing. Run SQL update."
      if (msg.includes("category")) msg = "Database column 'category' missing. Run SQL update."

      toast.error(`Error: ${msg}`)
      setCriticalError(msg)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    // Direct delete without confirmation as requested
    const { error } = await supabase.from("budgets").delete().eq("id", id)
    if (!error) {
      toast.success("Budget deleted")
      setBudgets(budgets.filter((b) => b.id !== id))
    } else {
      toast.error("Failed to delete budget")
    }
  }

  // --- HEALTH & INSIGHTS ---
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit_amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  const getContext = () => {
    if (totalLimit === 0) return null
    if (overallPercentage > 100) return { status: "Over Budget", color: "text-destructive", icon: AlertTriangle, msg: `You’ve exceeded your total budget by ${Math.round(overallPercentage - 100)}%.` }
    if (overallPercentage > 85) return { status: "Close to Limit", color: "text-orange-500", icon: AlertTriangle, msg: `You’ve used ${Math.round(overallPercentage)}% of your monthly budget.` }
    return { status: "On Track", color: "text-green-500", icon: CheckCircle, msg: `You’ve used ${Math.round(overallPercentage)}% of your total monthly budget.` }
  }

  const context = getContext()

  const getBudgetInsight = (b: Budget) => {
    const today = new Date().getDate()
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const dailyAvg = b.spent / (today || 1)
    const projected = dailyAvg * daysInMonth

    if (b.spent > b.limit_amount) return "Budget exceeded."
    if (projected > b.limit_amount && b.spent > (b.limit_amount * 0.5)) return "Pace suggests you might exceed this."
    if (b.spent > b.limit_amount * 0.9) return "Less than 10% remaining."
    return null
  }

  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center border-none shadow-none">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error Display Area */}
      {criticalError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Error</AlertTitle>
          <AlertDescription>
            {criticalError}. <br />
            <strong>Fix:</strong> Please run the Update SQL Script to fix table columns (category, limit_amount).
          </AlertDescription>
        </Alert>
      )}

      {/* 1. Health Summary */}
      {context && (
        <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <div className={`px-4 py-1.5 rounded-full bg-muted/50 ${context.color} font-medium text-sm flex items-center gap-2`}>
            <context.icon className="w-4 h-4" />
            {context.status}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{Math.round(overallPercentage)}% Used</h2>
            <p className="text-muted-foreground text-sm mt-1">{context.msg}</p>
          </div>
          <Progress value={Math.min(overallPercentage, 100)} className={`h-2 w-full max-w-md ${overallPercentage > 100 ? "[&>*]:bg-destructive" : ""}`} />
        </div>
      )}

      {/* 2. Budget Grid - Adjusted for smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit_amount) * 100
          const isExceeded = percentage > 100
          const isWarning = percentage > 80 && !isExceeded
          const insight = getBudgetInsight(budget)

          return (
            <Card key={budget.id} className="p-4 relative group overflow-hidden hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 pr-2">
                  <h3 className="font-semibold text-base truncate" title={budget.category}>{budget.category}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-medium">₹{budget.spent.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">/ ₹{budget.limit_amount.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="text-muted-foreground/40 hover:text-destructive transition-colors p-1 -mr-2 -mt-2"
                  title="Delete Budget"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Progress value={Math.min(percentage, 100)} className={`h-1.5 mb-3 ${isExceeded ? "[&>*]:bg-destructive" : isWarning ? "[&>*]:bg-orange-500" : "[&>*]:bg-primary"}`} />

              <div className="flex justify-between items-center text-xs">
                <span className={`${isExceeded ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                  {percentage.toFixed(0)}% Used
                </span>
                {insight && (
                  <span className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded truncate max-w-[50%]" title={insight}>
                    <Info className="w-3 h-3" /> <span className="truncate">{insight}</span>
                  </span>
                )}
              </div>
            </Card>
          )
        })}

        {/* Add New Card (Inline) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary gap-2 min-h-[140px]">
              <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shadow-sm">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium text-xs">Add Budget</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBudget} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Limit (₹)</label>
                <Input
                  type="number"
                  value={budgetLimit}
                  onChange={e => setBudgetLimit(e.target.value)}
                  placeholder="e.g. 5000"
                />
              </div>
              <Button type="submit" className="w-full">Save Budget</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
