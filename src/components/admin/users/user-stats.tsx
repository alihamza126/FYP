"use client"

import type { User } from "@/type/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, ShieldCheck, Calendar } from "lucide-react"

interface UserStatsProps {
  users: User[]
}

export function UserStats({ users }: UserStatsProps) {
  // Calculate statistics
  const totalUsers = users.length
  const verifiedUsers = users.filter((user) => user.isVerfied).length
  const adminUsers = users.filter((user) => user.role === "admin").length

  // Calculate users by month (last 6 months)
  const getMonthData = () => {
    const months = []
    const today = new Date()

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push({
        name: month.toLocaleString("default", { month: "short" }),
        count: 0,
      })
    }

    users.forEach((user) => {
      const createdAt = new Date(user.createdAt)
      const monthIndex = months.findIndex((m, i) => {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
        return createdAt.getMonth() === monthDate.getMonth() && createdAt.getFullYear() === monthDate.getFullYear()
      })
      

      if (monthIndex !== -1) {
        months[monthIndex].count++
      }
    })

    return months
  }

  const monthData = getMonthData()

  // Calculate gender distribution
  const maleUsers = users.filter((user) => user.gender === "male").length
  const femaleUsers = users.filter((user) => user.gender === "female").length
  const malePercentage = totalUsers > 0 ? Math.round((maleUsers / totalUsers) * 100) : 0
  const femalePercentage = totalUsers > 0 ? Math.round((femaleUsers / totalUsers) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthData[5].count}</div>
            <p className="text-xs text-muted-foreground">
              {monthData[4].count > 0
                ? `${monthData[5].count > monthData[4].count ? "+" : ""}${Math.round(((monthData[5].count - monthData[4].count) / monthData[4].count) * 100)}% from last month`
                : "No data from last month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Monthly User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <div className="flex h-full items-end gap-2">
                  {monthData.map((month, i) => (
                    <div key={i} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className="bg-primary rounded-md w-full animate-in"
                        style={{
                          height: `${Math.max(5, (month.count / Math.max(...monthData.map((m) => m.count))) * 100)}%`,
                        }}
                      />
                      <span className="mt-2 text-center text-xs">{month.name}</span>
                      <span className="text-center text-xs font-bold">{month.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Gender Distribution</span>
                  </div>
                  <div className="flex h-4 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-[10px] text-white"
                      style={{ width: `${malePercentage}%` }}
                    >
                      {malePercentage > 10 ? `${malePercentage}%` : ""}
                    </div>
                    <div
                      className="bg-pink-500 flex items-center justify-center text-[10px] text-white"
                      style={{ width: `${femalePercentage}%` }}
                    >
                      {femalePercentage > 10 ? `${femalePercentage}%` : ""}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>
                      Male: {maleUsers} ({malePercentage}%)
                    </span>
                    <span>
                      Female: {femaleUsers} ({femalePercentage}%)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Verification Status</span>
                  </div>
                  <div className="flex h-4 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-green-500 flex items-center justify-center text-[10px] text-white"
                      style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
                    >
                      {totalUsers > 0 && (verifiedUsers / totalUsers) * 100 > 10
                        ? `${Math.round((verifiedUsers / totalUsers) * 100)}%`
                        : ""}
                    </div>
                    <div
                      className="bg-orange-500 flex items-center justify-center text-[10px] text-white"
                      style={{ width: `${totalUsers > 0 ? ((totalUsers - verifiedUsers) / totalUsers) * 100 : 0}%` }}
                    >
                      {totalUsers > 0 && ((totalUsers - verifiedUsers) / totalUsers) * 100 > 10
                        ? `${Math.round(((totalUsers - verifiedUsers) / totalUsers) * 100)}%`
                        : ""}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>
                      Verified: {verifiedUsers} ({totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0}%)
                    </span>
                    <span>
                      Unverified: {totalUsers - verifiedUsers} (
                      {totalUsers > 0 ? Math.round(((totalUsers - verifiedUsers) / totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
