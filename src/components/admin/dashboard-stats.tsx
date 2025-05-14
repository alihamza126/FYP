"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalSales: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        totalProducts: 124,
        totalUsers: 843,
        totalRevenue: 12480,
        totalSales: 267,
      })
      setLoading(false)
    }, 1000)

    // In a real app, you would fetch from your API
    // const fetchStats = async () => {
    //   try {
    //     const res = await fetch('/api/admin/stats', {
    //       headers: {
    //         Authorization: `Bearer ${getCookie('admin_token')}`,
    //       },
    //     });
    //     const data = await res.json();
    //     if (data.success) {
    //       setStats(data.stats);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // fetchStats();
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+24 from last month</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
