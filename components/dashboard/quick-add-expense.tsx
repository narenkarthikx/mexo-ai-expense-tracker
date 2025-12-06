"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Receipt } from "lucide-react"

export default function QuickAddExpense() {
  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
        <Plus className="w-3 h-3 text-primary" />
        Add Expense
      </h3>

      <div className="flex gap-2">
        {/* Primary AI Receipt Upload Action */}
        <Link href="/expenses" className="flex-1">
          <Button className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-sm text-xs">
            <Receipt className="w-3 h-3 mr-1" />
            Smart Receipt
          </Button>
        </Link>

        {/* Manual Entry Option */}
        <Link href="/expenses" className="flex-1">
          <Button variant="outline" className="w-full h-8 border border-dashed border-primary/30 hover:border-primary/50 transition-all text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Manual
          </Button>
        </Link>
      </div>
    </Card>
  )
}
