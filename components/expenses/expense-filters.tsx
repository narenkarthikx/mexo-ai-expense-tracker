"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

const CATEGORIES = [
  "All",
  "Groceries",
  "Food & Dining",
  "Utilities",
  "Housing",
  "Transport",
  "Entertainment",
  "Health",
  "Other",
]

export default function ExpenseFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <Card className="p-5 bg-gradient-to-r from-card to-card/50 border-primary/10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filter Expenses</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
