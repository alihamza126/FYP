"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export function RecentProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching recent products
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          name: "Mesh Shirt",
          category: "fashion",
          price: 45,
          new: true,
          sale: false,
          thumbImage: ["/placeholder.svg?height=48&width=48"],
          createdAt: "2023-05-10T14:30:00Z",
        },
        {
          id: "2",
          name: "Casual Jacket",
          category: "fashion",
          price: 89.99,
          new: false,
          sale: true,
          thumbImage: ["/placeholder.svg?height=48&width=48"],
          createdAt: "2023-05-09T10:15:00Z",
        },
        {
          id: "3",
          name: "Summer Dress",
          category: "fashion",
          price: 59.99,
          new: true,
          sale: false,
          thumbImage: ["/placeholder.svg?height=48&width=48"],
          createdAt: "2023-05-08T16:45:00Z",
        },
        {
          id: "4",
          name: "Leather Boots",
          category: "footwear",
          price: 129.99,
          new: false,
          sale: false,
          thumbImage: ["/placeholder.svg?height=48&width=48"],
          createdAt: "2023-05-07T09:20:00Z",
        },
        {
          id: "5",
          name: "Designer Sunglasses",
          category: "accessories",
          price: 79.99,
          new: false,
          sale: true,
          thumbImage: ["/placeholder.svg?height=48&width=48"],
          createdAt: "2023-05-06T13:10:00Z",
        },
      ])
      setLoading(false)
    }, 1000)

    // In a real app, you would fetch from your API
    // const fetchRecentProducts = async () => {
    //   try {
    //     const res = await fetch('/api/products?limit=5&sort=createdAt&order=desc', {
    //       headers: {
    //         Authorization: `Bearer ${getCookie('admin_token')}`,
    //       },
    //     });
    //     const data = await res.json();
    //     if (data.success) {
    //       setProducts(data.products);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching recent products:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // fetchRecentProducts();
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
        <CardDescription>Latest products added to your store</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md overflow-hidden">
                  <img
                    src={product.thumbImage[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    {product.new && <Badge className="bg-green-500">New</Badge>}
                    {product.sale && <Badge className="bg-red-500">Sale</Badge>}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>${product.price.toFixed(2)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/admin/products">View All Products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
