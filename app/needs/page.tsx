"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader, ShoppingCart, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { Spinner } from "@/components/ui/spinner"

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
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [itemName, setItemName] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [priority, setPriority] = useState("medium")
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    } else if (user) {
      fetchWishlist()
    }
  }, [user, authLoading, router])

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!user) return null

  const totalEstimated = items.reduce((acc, item) => acc + (item.estimated_cost || 0), 0)
  const highPriority = items.filter((i) => i.priority === "high").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-7 h-7 text-primary" />
          <div>
            
            <p className="text-sm text-muted-foreground">Plan and track future purchases</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <p className="text-2xl font-bold text-primary">{items.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Items</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highPriority}</p>
            <p className="text-xs text-muted-foreground mt-1">High Priority</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalEstimated.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Cost</p>
          </Card>
        </div>

        {/* Items List First */}
        {loading ? (
          <Card className="p-12 flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10">
            <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium text-foreground">Your list is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items you want to buy below</p>
          </Card>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">YOUR ITEMS ({items.length})</h3>
            {items.map((item) => {
              const config = PRIORITY_CONFIG[item.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium
              return (
                <Card
                  key={item.id}
                  className="p-4 transition-all group hover:shadow-md border-l-4"
                  style={{ 
                    borderLeftColor: item.priority === 'high' ? 'rgb(239, 68, 68)' : item.priority === 'medium' ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)' 
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Flag className="w-4 h-4" style={{ color: item.priority === 'high' ? 'rgb(239, 68, 68)' : item.priority === 'medium' ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{item.item_name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {item.estimated_cost > 0 && (
                            <span className="text-sm font-medium text-primary">₹{item.estimated_cost.toFixed(0)}</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.text}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Add Item Form - Bottom */}
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Item
          </h3>
          <form onSubmit={handleAddItem} className="space-y-3">
            <Input
              type="text"
              placeholder="Item name (e.g., Winter Jacket)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="h-10"
              required
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                  <Input
                    type="number"
                    placeholder="Cost"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    step="100"
                    className="pl-7 h-10"
                  />
                </div>
              </div>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="col-span-1 px-3 py-2 border border-input rounded-lg bg-background text-sm"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Button type="submit" className="col-span-1 h-10">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
