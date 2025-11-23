"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader, ShoppingCart, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface WishlistItem {
  id: string
  item_name: string
  estimated_cost: number
  priority: string
}

const PRIORITY_CONFIG = {
  high: {
    color: "from-red-500 to-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
  },
  medium: {
    color: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  low: {
    color: "from-green-500 to-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
  },
}

export default function NeedsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [itemName, setItemName] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [priority, setPriority] = useState("medium")
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
      fetchWishlist()
    }
  }, [router])

  const fetchWishlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true })

      if (!error && data) {
        setItems(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("wishlist").insert([
        {
          user_id: user.id,
          item_name: itemName,
          estimated_cost: estimatedCost ? Number.parseFloat(estimatedCost) : null,
          priority,
        },
      ])

      if (!error) {
        setItemName("")
        setEstimatedCost("")
        setPriority("medium")
        await fetchWishlist()
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

  if (!mounted || !user) return null

  const totalEstimated = items.reduce((acc, item) => acc + (item.estimated_cost || 0), 0)
  const highPriority = items.filter((i) => i.priority === "high").length

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Shopping List & Needs
          </h1>
          <p className="text-muted-foreground mt-2">Plan future purchases and organize your wishlist</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-3xl font-bold text-primary mt-2">{items.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="text-3xl font-bold text-accent mt-2">{highPriority}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">${totalEstimated.toFixed(2)}</p>
          </Card>
        </div>

        {/* Add Item Form */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add to Shopping List
          </h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Item Name</label>
              <Input
                type="text"
                placeholder="e.g., Winter Jacket"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="h-11 bg-input border-border"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    step="0.01"
                    className="pl-7 h-11 bg-input border-border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 border border-input rounded-lg bg-input"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Item to List
            </Button>
          </form>
        </Card>

        {/* Items List */}
        {loading ? (
          <Card className="p-12 flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold text-foreground">Your shopping list is empty</p>
            <p className="text-muted-foreground mt-1">Start adding items you plan to buy</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const config = PRIORITY_CONFIG[item.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium
              return (
                <Card
                  key={item.id}
                  className={`p-5 bg-gradient-to-r from-card to-card/50 border-primary/5 hover:border-primary/20 transition-all group flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Flag
                      className={`w-5 h-5 flex-shrink-0 text-${item.priority === "high" ? "destructive" : item.priority === "medium" ? "accent" : "green-600"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-lg">{item.item_name}</p>
                      {item.estimated_cost && (
                        <p className="text-sm text-muted-foreground">Estimated: ${item.estimated_cost.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                      {item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
