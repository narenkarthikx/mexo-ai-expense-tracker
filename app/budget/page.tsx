"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import BudgetManager from "@/components/budget/budget-manager"
import BudgetCharts from "@/components/budget/budget-charts"
import { PiggyBank } from "lucide-react"

export default function BudgetPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  if (!mounted) return null
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <PiggyBank className="w-8 h-8 text-primary" />
            Budget Management
          </h1>
          <p className="text-muted-foreground mt-2">Set and monitor spending limits for each category</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetManager />
          </div>
          <div>
            <BudgetCharts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
