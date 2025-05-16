"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, RefreshCw } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { OrderType } from "@/type/orders"
import { fetchOrders } from "@/lib/apis/orders"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true)
        const data = await fetchOrders()
        setOrders(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch orders")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter ? order.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow text-white"
      case "paid":
        return "bg-green text-white"
      case "shipped":
        return "bg-blue text-white"
      case "delivered":
        return "bg-purple text-white"
      case "cancelled":
        return "bg-red text-white"
      default:
        return "bg-gray text-white"
    }
  }

  const refreshOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders()
      setOrders(data)
      setError(null)
    } catch (err) {
      setError("Failed to refresh orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={() => router.push("/admin/orders/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
          <CardDescription>Overview of all orders in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-yellow/50 p-4 rounded-lg">
              <p className="text-sm text-warning">Pending</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
            </div>
            <div className="bg-green/50 p-4 rounded-lg">
              <p className="text-sm text-success">Paid</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "paid").length}</p>
            </div>
            <div className="bg-purple/50  p-4 rounded-lg">
              <p className="text-sm text-primary">Shipped</p>
              <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by order ID or customer email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{error}</div>}

      <div className="bg-white rounded-md shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCw className="animate-spin h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : currentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No orders found</p>
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.userId?.email || order.shippingInfo?.email || "N/A"}</TableCell>
                  <TableCell>{order.createdAt ? formatDate(order.createdAt) : "N/A"}</TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>{formatCurrency(order.amount || 0, order.currency || "USD")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
