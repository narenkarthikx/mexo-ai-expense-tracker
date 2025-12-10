"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Download, Calendar } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

export default function PDFExport() {
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  // Set default dates (current month)
  const getDefaultDates = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
      start: startOfMonth.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0]
    }
  }

  const generatePDF = async () => {
    try {
      setLoading(true)
      
      // Use selected dates or default to current month
      const dates = startDate && endDate 
        ? { start: startDate, end: endDate }
        : getDefaultDates()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please log in to export data")
        return
      }

      // Fetch expenses for selected period
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", dates.start)
        .lte("date", dates.end)
        .order("date", { ascending: false })

      if (expensesError) {
        console.error("Error fetching expenses:", expensesError)
        toast.error("Failed to fetch expenses")
        return
      }

      // Fetch budgets
      const { data: budgets } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)

      if (!expenses || expenses.length === 0) {
        toast.error("No expenses found for the selected period")
        setLoading(false)
        return
      }

      // Create PDF
      const pdf = new jsPDF()
      let yPosition = 20

      // Title
      pdf.setFontSize(20)
      pdf.text("Expense Report", 20, yPosition)
      yPosition += 15

      // Period
      pdf.setFontSize(11)
      const startDateObj = new Date(dates.start)
      const endDateObj = new Date(dates.end)
      pdf.text(
        `Period: ${startDateObj.toLocaleDateString()} - ${endDateObj.toLocaleDateString()}`,
        20,
        yPosition
      )
      yPosition += 10

      // Summary Stats
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const totalBudget = budgets?.reduce((sum, b) => sum + b.limit, 0) || 0
      const expenseCount = expenses.length

      pdf.setFontSize(12)
      pdf.text("Summary", 20, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.text(`Total Expenses: ${expenseCount}`, 25, yPosition)
      yPosition += 6
      pdf.text(`Total Spent: ₹${totalExpenses.toFixed(2)}`, 25, yPosition)
      yPosition += 6
      if (totalBudget > 0) {
        pdf.text(`Total Budget: ₹${totalBudget.toFixed(2)}`, 25, yPosition)
        yPosition += 6
        pdf.text(`Remaining: ₹${(totalBudget - totalExpenses).toFixed(2)}`, 25, yPosition)
        yPosition += 6
      }
      yPosition += 6

      // Category Breakdown
      const categoryTotals = expenses.reduce((acc: any, exp) => {
        const cat = exp.category || "Other"
        acc[cat] = (acc[cat] || 0) + exp.amount
        return acc
      }, {})

      pdf.setFontSize(12)
      pdf.text("Category Breakdown", 20, yPosition)
      yPosition += 8

      const categoryData = Object.entries(categoryTotals)
        .sort(([, a]: any, [, b]: any) => b - a)
        .map(([cat, amount]: any) => [
          cat,
          `₹${amount.toFixed(2)}`,
          `${((amount / totalExpenses) * 100).toFixed(1)}%`
        ])

      autoTable(pdf, {
        startY: yPosition,
        head: [["Category", "Amount", "% of Total"]],
        body: categoryData,
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }
      })

      yPosition = (pdf as any).lastAutoTable.finalY + 12

      // Expenses Table (limit to first 50 for PDF space)
      pdf.setFontSize(12)
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text("Recent Expenses", 20, yPosition)
      yPosition += 8

      const expenseTableData = expenses.slice(0, 50).map((exp) => [
        new Date(exp.date).toLocaleDateString(),
        (exp.description || "N/A").substring(0, 30),
        exp.category || "Other",
        `₹${exp.amount.toFixed(2)}`
      ])

      autoTable(pdf, {
        startY: yPosition,
        head: [["Date", "Description", "Category", "Amount"]],
        body: expenseTableData,
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      })

      if (expenses.length > 50) {
        const finalY = (pdf as any).lastAutoTable.finalY
        pdf.setFontSize(8)
        pdf.text(
          `Note: Showing first 50 of ${expenses.length} expenses`,
          20,
          finalY + 5
        )
      }

      // Download
      const filename = `expense-report-${dates.start}-to-${dates.end}.pdf`
      pdf.save(filename)
      
      toast.success("PDF exported successfully!")
      setOpen(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date Range
            </h4>
            <p className="text-xs text-muted-foreground">
              Choose the period for your expense report
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-xs">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const defaults = getDefaultDates()
                setStartDate(defaults.start)
                setEndDate(defaults.end)
              }}
              className="flex-1"
            >
              This Month
            </Button>
            <Button
              onClick={generatePDF}
              disabled={loading}
              size="sm"
              className="flex-1"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {!startDate || !endDate
              ? "Leave empty to export current month"
              : `Exporting from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
