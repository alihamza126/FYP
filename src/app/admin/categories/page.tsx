"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { CloudinaryUploader } from "@/components/upload/Uploader"
import Axios from "@/lib/Axios"
import toast from "react-hot-toast"

interface Category {
  _id: string
  name: string
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await Axios.get("/api/v1/category");
      const data = response.data.categories;
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }


  const resetForm = () => {
    setName("")
    setImageFile(null)
    setImagePreview("")
    setUploadedImageUrl("")
    setSelectedCategory(null)
  }

  const handleCloudinaryUpload = (files: { url: string }[]) => {
    if (files && files.length > 0) {
      const url = files[0].url
      setUploadedImageUrl(url)
      setImagePreview(url)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !uploadedImageUrl) return

    try {
      const response = await fetch("/api/v1/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: uploadedImageUrl,
        }),
      })

      if (!response.ok) throw new Error("Failed to add category")

      await fetchCategories()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !name) return

    try {
      const imageUrl = uploadedImageUrl || selectedCategory.image

      const response = await Axios.put(`/api/v1/category/${selectedCategory._id}`, {
        name,
        image: imageUrl
      });

      toast.success("Category updated successfully");

      await fetchCategories()
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/category/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete category")

      await fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setName(category.name)
    setImagePreview(category.image)
    setUploadedImageUrl(category.image)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddCategory}>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new category with name and image.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <CloudinaryUploader maxFiles={1} onUploadComplete={handleCloudinaryUpload} />
                  </div>
                </div>
                {imagePreview && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">
                      <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditCategory}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the category details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <CloudinaryUploader maxFiles={1} onUploadComplete={handleCloudinaryUpload} />
                </div>
              </div>
              {imagePreview && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">
                    <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
