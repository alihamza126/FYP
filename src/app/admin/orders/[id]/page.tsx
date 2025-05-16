"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Truck, CreditCard, Package, CheckCircle, XCircle, RefreshCw, Printer, Mail } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { OrderType } from "@/type/orders"
import { updateOrderStatus, deleteOrder, fetchOrder } from "@/lib/apis/orders"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [order, setOrder] = useState<OrderType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusLoading, setStatusLoading] = useState(false)
    const [newStatus, setNewStatus] = useState("")

    useEffect(() => {
        const getOrder = async () => {
            try {
                setLoading(true)
                const data = await fetchOrder(params.id);
                console.log(data)
                setOrder(data)
                setNewStatus(data.status)
                setError(null)
            } catch (err) {
                setError("Failed to fetch order details")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        getOrder()
    }, [params.id])

    const handleStatusUpdate = async () => {
        if (!order || newStatus === order.status) return

        try {
            setStatusLoading(true)
            await updateOrderStatus(order._id, newStatus)

            // Update local state
            setOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
        } catch (err) {
            setError("Failed to update order status")
            console.error(err)
        } finally {
            setStatusLoading(false)
        }
    }

    const handleDeleteOrder = async () => {
        if (!order) return

        try {
            await deleteOrder(order._id)
            router.push("/admin/orders")
        } catch (err) {
            setError("Failed to delete order")
            console.error(err)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <CreditCard className="h-5 w-5 text-yellow-500" />
            case "paid":
                return <CreditCard className="h-5 w-5 text-green-500" />
            case "shipped":
                return <Truck className="h-5 w-5 text-blue-500" />
            case "delivered":
                return <CheckCircle className="h-5 w-5 text-purple-500" />
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-500" />
            default:
                return <Package className="h-5 w-5" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "paid":
                return "bg-green-100 text-green-800"
            case "shipped":
                return "bg-blue-100 text-blue-800"
            case "delivered":
                return "bg-purple-100 text-purple-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="animate-spin h-8 w-8 text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="p-6">
                <Button variant="outline" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Error Loading Order</h2>
                            <p className="text-muted-foreground mb-4">{error || "Order not found"}</p>
                            <Button onClick={() => router.push("/admin/orders")}>Return to Orders</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
                <Button variant="outline" onClick={() => router.back()} className="mr-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
                <Badge className={`ml-4 ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="mr-2 h-5 w-5" /> Order Items
                            </CardTitle>
                            <CardDescription>{order.items?.length || 0} items in this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {item.productId?.name || `Product ID: ${item.productId?._id || "Unknown"}`}
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.productId?.price
                                                        ? formatCurrency(item.productId.price * item.quantity, order.currency || "USD")
                                                        : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                                No items in this order
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Subtotal</p>
                                <p className="text-lg font-semibold">{formatCurrency(order.amount || 0, order.currency || "USD")}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Printer className="mr-2 h-4 w-4" /> Print
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Mail className="mr-2 h-4 w-4" /> Email
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="font-medium">{order.isCod ? "Cash on Delivery" : "Credit Card"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Status</p>
                                    <Badge
                                        className={getStatusColor(
                                            order.status === "paid" || order.status === "shipped" || order.status === "delivered"
                                                ? "paid"
                                                : "pending",
                                        )}
                                    >
                                        {order.status === "paid" || order.status === "shipped" || order.status === "delivered"
                                            ? "Paid"
                                            : "Pending"}
                                    </Badge>
                                </div>
                                {order.paymentIntentId && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Payment ID</p>
                                        <p className="font-medium">{order.paymentIntentId}</p>
                                    </div>
                                )}
                                {order.paidAt && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Paid On</p>
                                        <p className="font-medium">{formatDate(order.paidAt)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l-2 border-muted pl-6 pb-2">
                                <div className="mb-8 relative">
                                    <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border border-white bg-primary"></div>
                                    <p className="font-semibold">Order Created</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.createdAt ? formatDate(order.createdAt, true) : "Unknown date"}
                                    </p>
                                </div>

                                {order.status !== "pending" && (
                                    <div className="mb-8 relative">
                                        <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border border-white bg-green-500"></div>
                                        <p className="font-semibold">Payment Received</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.paidAt ? formatDate(order.paidAt, true) : "Unknown date"}
                                        </p>
                                    </div>
                                )}

                                {(order.status === "shipped" || order.status === "delivered") && (
                                    <div className="mb-8 relative">
                                        <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border border-white bg-blue-500"></div>
                                        <p className="font-semibold">Order Shipped</p>
                                        <p className="text-sm text-muted-foreground">
                                            {/* Assuming we don't have a shippedAt field */}
                                            {formatDate(new Date(), true)}
                                        </p>
                                    </div>
                                )}

                                {order.status === "delivered" && (
                                    <div className="mb-8 relative">
                                        <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border border-white bg-purple-500"></div>
                                        <p className="font-semibold">Order Delivered</p>
                                        <p className="text-sm text-muted-foreground">
                                            {/* Assuming we don't have a deliveredAt field */}
                                            {formatDate(new Date(), true)}
                                        </p>
                                    </div>
                                )}

                                {order.status === "cancelled" && (
                                    <div className="mb-8 relative">
                                        <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border border-white bg-red-500"></div>
                                        <p className="font-semibold">Order Cancelled</p>
                                        <p className="text-sm text-muted-foreground">
                                            {/* Assuming we don't have a cancelledAt field */}
                                            {formatDate(new Date(), true)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Update Order Status</p>
                                <div className="flex gap-2">
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleStatusUpdate} disabled={statusLoading || newStatus === order.status}>
                                        {statusLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                        Update
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
                                >
                                    Edit Order Details
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full justify-start">
                                            Delete Order
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the order and remove the data from
                                                our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteOrder}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Customer</p>
                                <p className="font-medium">
                                    {order.userId?.name ||
                                        `${order.shippingInfo?.firstName || ""} ${order.shippingInfo?.lastName || ""}`.trim() ||
                                        "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{order.userId?.email || order.shippingInfo?.email || "N/A"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{order.shippingInfo?.phone || "N/A"}</p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium mb-2">Shipping Address</p>
                                {order.shippingInfo ? (
                                    <div className="text-sm">
                                        <p>{order.shippingInfo.address}</p>
                                        <p>
                                            {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}
                                        </p>
                                        <p>{order.shippingInfo.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No shipping information available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
