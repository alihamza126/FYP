"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash, RefreshCw, Save } from "lucide-react"
import type { OrderType } from "@/type/orders"
import { fetchOrder, updateOrder } from "@/lib/apis/orders"

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    status: "",
    shippingInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    items: [] as { productId: string; quantity: number }[],
    amount: 0,
    currency: "USD",
    isCod: false,
  })

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true)
        const data = await fetchOrder(params.id)
        setOrder(data)

        // Initialize form data with order data
        setFormData({
          status: data.status,
          shippingInfo: {
            firstName: data.shippingInfo?.firstName || "",
            lastName: data.shippingInfo?.lastName || "",
            email: data.shippingInfo?.email || "",
            phone: data.shippingInfo?.phone || "",
            address: data.shippingInfo?.address || "",
            city: data.shippingInfo?.city || "",
            state: data.shippingInfo?.state || "",
            zip: data.shippingInfo?.zip || "",
            country: data.shippingInfo?.country || "",
          },
          items:
            data.items?.map((item) => ({
              productId: item.productId?._id || (item.productId as string),
              quantity: item.quantity,
            })) || [],
          amount: data.amount || 0,
          currency: data.currency || "USD",
          isCod: data.isCod || false,
        })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.startsWith("shippingInfo.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        shippingInfo: {
          ...prev.shippingInfo,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }
      return {
        ...prev,
        items: updatedItems,
      }
    })
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1 }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!order) return

    try {
      setSaving(true)
      await updateOrder(order._id, formData)
      router.push(`/admin/orders/${order._id}`)
    } catch (err) {
      setError("Failed to update order")
      console.error(err)
      setSaving(false)
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
              <p className="text-red-500 mb-4">{error || "Order not found"}</p>
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
        <h1 className="text-3xl font-bold">Edit Order #{order.orderId}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Manage the products in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                            placeholder="Product ID"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {formData.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No items in this order
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <Button type="button" variant="outline" className="mt-4" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCod"
                    name="isCod"
                    checked={formData.isCod}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isCod">Cash on Delivery</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="shippingInfo.firstName"
                      value={formData.shippingInfo.firstName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="shippingInfo.lastName"
                      value={formData.shippingInfo.lastName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="shippingInfo.email"
                      type="email"
                      value={formData.shippingInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="shippingInfo.phone"
                      value={formData.shippingInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="shippingInfo.address"
                      value={formData.shippingInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="shippingInfo.city"
                      value={formData.shippingInfo.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="shippingInfo.state"
                      value={formData.shippingInfo.state}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input
                      id="zip"
                      name="shippingInfo.zip"
                      value={formData.shippingInfo.zip}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="shippingInfo.country"
                      value={formData.shippingInfo.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Save Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Save Order
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
