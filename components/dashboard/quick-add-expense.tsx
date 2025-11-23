"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader, Receipt } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const CATEGORIES = [
  { name: "Groceries", icon: "🛒", color: "from-green-500 to-green-600" },
  { name: "Dining", icon: "🍽️", color: "from-orange-500 to-orange-600" },
  { name: "Utilities", icon: "💡", color: "from-yellow-500 to-yellow-600" },
  { name: "Housing", icon: "🏠", color: "from-blue-500 to-blue-600" },
  { name: "Transport", icon: "🚗", color: "from-purple-500 to-purple-600" },
  { name: "Entertainment", icon: "🎬", color: "from-pink-500 to-pink-600" },
  { name: "Health", icon: "⚕️", color: "from-red-500 to-red-600" },
  { name: "Other", icon: "📌", color: "from-gray-500 to-gray-600" },
]

export default function QuickAddExpense() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("expenses").insert([
        {
          user_id: user.id,
          amount: Number.parseFloat(amount),
          description: description || category,
          date: new Date().toISOString().split("T")[0],
          processing_status: 'completed',
        },
      ])

      if (!error) {
        setAmount("")
        setDescription("")
        setCategory("")
        toast({
          title: "Expense Added",
          description: `Successfully added $${amount} expense`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add expense",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary" />
        Quick Add Expense
      </h3>

      <div className="space-y-5">
        {/* AI Receipt Upload Link */}
        <Link href="/expenses">
          <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            <Receipt className="w-5 h-5 mr-2" />
            📱 Upload Receipt with AI
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          Go to Expenses page for AI receipt processing
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Manual Entry Form */}
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                className="pl-7 h-10 bg-input border-border"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              type="text"
              placeholder="What did you buy?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 bg-input border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    category === cat.name ? `border-primary bg-primary/10` : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium truncate">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
            disabled={loading || !category}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
