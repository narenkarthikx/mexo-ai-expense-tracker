"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader, ShoppingCart, Flag, Check, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  id: string
  item_name: string
  estimated_cost: number
  priority: string
  category: string
}

interface Budget {
  category: string
  limit: number
}

const PRIORITY_CONFIG = {
  high: {
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-l-red-500",
  },
  medium: {
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-l-yellow-500",
  },
  low: {
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-l-green-500",
  },
}

const DEFAULT_CATEGORIES = [
  "Groceries", "Dining", "Transportation", "Shopping", "Healthcare",
  "Entertainment", "Utilities", "Travel", "Gas", "Other"
]

export default function ShoppingListPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [items, setItems] = useState<WishlistItem[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)

  // Form State
  const [itemName, setItemName] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("Shopping")

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    } else if (user) {
      loadData()
    }
  }, [user, authLoading, router])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load Categories
      const { data: catData } = await supabase.from('user_categories').select('categories').eq('user_id', user.id).single()
      if (catData?.categories) setCategories(catData.categories)

      // Load Wishlist
      const { data: listData } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true })

      // Load Budgets for impact calc
      const { data: budgetData } = await supabase.from("budgets").select("category, limit").eq("user_id", user.id)

      if (listData) setItems(listData)
      if (budgetData) setBudgets(budgetData)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("wishlist").insert([{
        user_id: user.id,
        item_name: itemName,
        estimated_cost: estimatedCost ? Number.parseFloat(estimatedCost) : 0,
        priority,
        category
      }])

      if (!error) {
        setItemName("")
        setEstimatedCost("")
        setPriority("medium")
        setCategory("Shopping")
        toast({ title: "Item Planned", description: "Added to your shopping list." })
        await loadData()
      } else {
        console.error("Insert error", error)
        toast({ title: "Error", description: "Could not add item.", variant: "destructive" })
      }
    } catch (err) {
      console.error("Error adding item:", err)
    }
  }

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id)
    if (!error) {
      setItems(items.filter((i) => i.id !== id))
    }
  }

  const handlePurchase = async (item: WishlistItem) => {
    if (!confirm(`Mark "${item.item_name}" as purchased? This will move it to Expenses.`)) return

    try {
      const { error: expError } = await supabase.from("expenses").insert([{
        user_id: user?.id,
        amount: item.estimated_cost,
        description: item.item_name,
        category: item.category || "Shopping",
        date: new Date().toISOString().split("T")[0],
        processing_status: "completed"
      }])

      if (expError) throw expError

      // Delete from wishlist
      await handleDeleteItem(item.id)

      toast({ title: "Purchased!", description: "Moved to expenses." })
      router.refresh()
      window.dispatchEvent(new Event('expense-added')) // Update dashboard if needed
    } catch (error) {
      toast({ title: "Error", description: "Failed to move to expenses.", variant: "destructive" })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Shopping List</h1>
            <p className="text-sm text-muted-foreground">Future Intent & Impact</p>
          </div>
        </div>

        {/* Empty State / List */}
        {items.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-medium text-foreground">Your list is empty</h3>
            <p className="text-muted-foreground mt-2 mb-6">Plan purchases before you spend to avoid budget surprises.</p>
            <Button onClick={() => document.getElementById('add-item-form')?.focus()} variant="outline">
              Add Planned Item
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const config = PRIORITY_CONFIG[item.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium
              const itemBudget = budgets.find(b => b.category === item.category)
              const impact = itemBudget && itemBudget.limit > 0 ? (item.estimated_cost / itemBudget.limit) * 100 : 0
              const isHighImpact = impact > 25

              return (
                <Card key={item.id} className={`p-4 group relative overflow-hidden border-l-4 ${config.border} hover:shadow-md transition-all`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-xs text-muted-foreground">• {item.category}</span>
                      </div>

                      <h3 className="font-semibold text-lg">{item.item_name}</h3>

                      {/* Budget Impact Warning */}
                      {itemBudget && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs">
                          {isHighImpact ? <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> : <div className="w-3.5" />}
                          <span className={isHighImpact ? "text-orange-600 font-medium" : "text-muted-foreground"}>
                            Uses {impact.toFixed(0)}% of {item.category} budget
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">₹{item.estimated_cost.toFixed(0)}</p>
                      <div className="flex items-center justify-end gap-1 mt-3">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-green-600" onClick={() => handlePurchase(item)} title="Mark as Purchased">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteItem(item.id)} title="Remove">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Add Item Form */}
        <Card className="p-6 bg-muted/20 border-primary/10 mt-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Planned Item
          </h3>
          <form id="add-item-form" onSubmit={handleAddItem} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Item name (e.g., Winter Jacket)"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="Cost"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="pl-7"
                />
              </div>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Add to List</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
