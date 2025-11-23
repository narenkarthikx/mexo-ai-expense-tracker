"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { createClient } from "@/lib/supabase-client"

export default function PDFExport() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const generatePDF = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch all data needed for report
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])
        .order("date", { ascending: false })

      const { data: budgets } = await supabase.from("budgets").select("*").eq("user_id", user.id)

      // Create PDF
      const pdf = new jsPDF()
      let yPosition = 20

      // Title
      pdf.setFontSize(20)
      pdf.text("Monthly Expense Report", 20, yPosition)
      yPosition += 15

      // Period
      pdf.setFontSize(11)
      pdf.text(`Period: ${startOfMonth.toLocaleDateString()} - ${today.toLocaleDateString()}`, 20, yPosition)
      yPosition += 10

      // Summary Stats
      const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
      const totalBudget = budgets?.reduce((sum, b) => sum + b.limit_amount, 0) || 0

      pdf.setFontSize(12)
      pdf.text("Summary", 20, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.text(`Total Spent: $${totalExpenses.toFixed(2)}`, 25, yPosition)
      yPosition += 6
      pdf.text(`Total Budget: $${totalBudget.toFixed(2)}`, 25, yPosition)
      yPosition += 6
      pdf.text(`Remaining: $${(totalBudget - totalExpenses).toFixed(2)}`, 25, yPosition)
      yPosition += 12

      // Expenses Table
      if (expenses && expenses.length > 0) {
        pdf.setFontSize(12)
        pdf.text("Expenses", 20, yPosition)
        yPosition += 8

        const expenseTableData = expenses.map((exp) => [
          exp.date,
          exp.description || "N/A",
          `$${exp.amount.toFixed(2)}`,
        ])

        const autoTable = pdf as any
        autoTable.autoTable({
          startY: yPosition,
          head: [["Date", "Description", "Amount"]],
          body: expenseTableData,
          margin: { left: 20, right: 20 },
        })

        yPosition = autoTable.lastAutoTable.finalY + 10
      }

      // Budgets Table
      if (budgets && budgets.length > 0) {
        pdf.setFontSize(12)
        pdf.text("Budgets", 20, yPosition)
        yPosition += 8

        const budgetTableData = budgets.map((budget) => [
          budget.category_id || "General",
          `$${budget.limit_amount.toFixed(2)}`,
        ])

        const autoTable = pdf as any
        autoTable.autoTable({
          startY: yPosition,
          head: [["Category", "Limit"]],
          body: budgetTableData,
          margin: { left: 20, right: 20 },
        })
      }

      // Download
      pdf.save(`expense-report-${today.toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={generatePDF} disabled={loading} className="gap-2">
      {loading ? (
        <>
          <span className="animate-spin">⟳</span>
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export to PDF
        </>
      )}
    </Button>
  )
}
