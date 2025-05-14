"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Plus, Search, MoreVertical, Edit, Trash } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Get query params
  const page = Number.parseInt(searchParams.get("page") || "1")
  const search = searchParams.get("search") || ""
  const categoryFilter = searchParams.get("category") || ""

  useEffect(() => {
    setSearchTerm(search)
    setCategory(categoryFilter)
    fetchProducts(page, search, categoryFilter)
  }, [page, search, categoryFilter])

  const fetchProducts = async (page = 1, search = "", category = "") => {
    try {
      setLoading(true)

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      if (search) queryParams.append("search", search)
      if (category) queryParams.append("category", category)

      const res = await fetch(`/api/v1/product?${queryParams.toString()}`, {
        method: "GET",
      })


      const data = await res.json()

      if (data.success) {
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (category) params.append("category", category)

    router.push(`/admin/products?${params.toString()}`)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)

    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (value) params.append("category", value)

    router.push(`/admin/products?${params.toString()}`)
  }

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`/api/products/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("admin_token")}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })

        // Refresh products
        fetchProducts(pagination.page, searchTerm, category)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteProductId(null)
    }
  }

  // Helper function to get cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.thumbImage && product.thumbImage[0] ? (
                      <img
                        src={product.thumbImage[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {product.new && <Badge className="bg-purple mr-1">New</Badge>}
                    {product.sale && <Badge className="bg-red">Sale</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/admin/products?page=${Math.max(1, pagination.page - 1)}${searchTerm ? `&search=${searchTerm}` : ""}${category ? `&category=${category}` : ""}`}
                aria-disabled={pagination.page === 1}
              />
            </PaginationItem>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first page, last page, current page, and pages around current page
                return p === 1 || p === pagination.pages || (p >= pagination.page - 1 && p <= pagination.page + 1)
              })
              .map((p, i, arr) => {
                // Add ellipsis
                const showEllipsisBefore = i > 0 && arr[i - 1] !== p - 1
                const showEllipsisAfter = i < arr.length - 1 && arr[i + 1] !== p + 1

                return (
                  <React.Fragment key={p}>
                    {showEllipsisBefore && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href={`/admin/products?page=${p}${searchTerm ? `&search=${searchTerm}` : ""}${category ? `&category=${category}` : ""}`}
                        isActive={pagination.page === p}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                    {showEllipsisAfter && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                  </React.Fragment>
                )
              })}

            <PaginationItem>
              <PaginationNext
                href={`/admin/products?page=${Math.min(pagination.pages, pagination.page + 1)}${searchTerm ? `&search=${searchTerm}` : ""}${category ? `&category=${category}` : ""}`}
                aria-disabled={pagination.page === pagination.pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
