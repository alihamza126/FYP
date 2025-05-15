"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/admin/users/UserTable"
import { UserForm } from "@/components/admin/users/UserForm"
import { UserStats } from "@/components/admin/users/user-stats"
import type { User } from "@/type/user"
import { fetchUsers } from "@/lib/AdminApis"


export default function Page() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const data = await fetchUsers();
        setUsers(data?.users||[])
      } catch (err) {
        setError("Failed to load users. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser])
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
  }

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, edit, and delete users from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : (
                <UserTable users={users} onUserUpdated={handleUserUpdated} onUserDeleted={handleUserDeleted} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm onUserAdded={handleUserAdded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Overview of user metrics and statistics.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserStats users={users} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
