"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalesSummary() {
  const [period, setPeriod] = useState("7days")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    // Simulate fetching sales data
    setLoading(true)

    setTimeout(() => {
      // Generate some random data based on the selected period
      let days
      switch (period) {
        case "30days":
          days = 30
          break
        case "90days":
          days = 90
          break
        default:
          days = 7
      }

      const newData = []
      const today = new Date()

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        newData.push({
          date: date.toISOString().split("T")[0],
          sales: Math.floor(Math.random() * 50) + 10,
          revenue: (Math.random() * 1000 + 500).toFixed(2),
        })
      }

      setData(newData)
      setLoading(false)
    }, 1000)

    // In a real app, you would fetch from your API
    // const fetchSalesData = async () => {
    //   try {
    //     const res = await fetch(`/api/admin/sales?period=${period}`, {
    //       headers: {
    //         Authorization: `Bearer ${getCookie('admin_token')}`,
    //       },
    //     });
    //     const data = await res.json();
    //     if (data.success) {
    //       setData(data.sales);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching sales data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // fetchSalesData();
  }, [period])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Calculate totals
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0)
  const totalRevenue = data.reduce((sum, item) => sum + Number.parseFloat(item.revenue), 0).toFixed(2)

  // Get max values for scaling the chart
  const maxSales = Math.max(...data.map((item) => item.sales), 1)

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Sales Summary</CardTitle>
          <CardDescription>Overview of your store sales</CardDescription>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              ) : (
                <p className="text-2xl font-bold">{totalSales}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              {loading ? (
                <div className="h-6 w-20 animate-pulse rounded bg-muted"></div>
              ) : (
                <p className="text-2xl font-bold">${totalRevenue}</p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="h-[200px] w-full animate-pulse rounded bg-muted"></div>
          ) : (
            <div className="h-[200px] w-full">
              <div className="flex h-full items-end gap-2">
                {data.map((item, i) => (
                  <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                    <div
                      className="bg-primary rounded-t w-full"
                      style={{ height: `${(item.sales / maxSales) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-muted-foreground">{formatDate(item.date)}</div>
                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {item.sales} sales
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
