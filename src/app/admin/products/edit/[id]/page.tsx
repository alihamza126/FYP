"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Plus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Axios from "@/lib/Axios"
import { CloudinaryUploader } from "@/components/upload/Uploader"

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  gender: z.string().min(1, "Gender is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().positive("Price must be positive"),
  originPrice: z.coerce.number().positive("Original price must be positive").optional(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  new: z.boolean().default(false),
  sale: z.boolean().default(false),
  slug: z.string().optional(),
})

export default function EditProductPage({ params }) {
  const productId = params?.id
  const router = useRouter()
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState("")
  const [variations, setVariations] = useState([])
  const [newVariation, setNewVariation] = useState({
    color: "",
    colorCode: "#000000",
    colorImage: "",
    image: "",
  })
  const [images, setImages] = useState([])
  const [thumbImages, setThumbImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [productLoading, setProductLoading] = useState(true)

  // Initialize form
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      type: "",
      gender: "",
      brand: "",
      price: 0,
      originPrice: 0,
      quantity: 1,
      description: "",
      new: false,
      sale: false,
      slug: "",
    },
  })

  const fetchCategories = async () => {
    try {
      const response = await Axios.get("/api/v1/category")
      const data = response.data.categories
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const fetchProduct = async () => {
    if (!productId) return

    try {
      setProductLoading(true)
      const response = await Axios.get(`/api/v1/product/${productId}`)
      const product = response.data.product

      // Set form values
      form.reset({
        name: product.name || "",
        category: product.category || "",
        type: product.type || "",
        gender: product.gender || "",
        brand: product.brand || "",
        price: product.price || 0,
        originPrice: product.originPrice || 0,
        quantity: product.quantity || 1,
        description: product.description || "",
        new: product.new || false,
        sale: product.sale || false,
        slug: product.slug || "",
      })

      // Set arrays
      setSizes(product.sizes || [])
      setVariations(product.variation || [])
      setImages(product.images || [])
      setThumbImages(product.thumbImage || [])
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      })
    } finally {
      setProductLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [productId])

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // Add arrays to form data
      const productData = {
        ...data, // Include all form data
        sizes,
        variation: variations,
        images,
        thumbImage: thumbImages,
      }

      // Generate slug if not provided
      if (!productData.slug) {
        productData.slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      }

      console.log("Updated Product Data:", productData)

      const res = await Axios.put(`/api/v1/product/${productId}`, productData)
      console.log(res.data)
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper functions for array fields
  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const removeSize = (size) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const addVariation = () => {
    if (newVariation.color && newVariation.colorCode) {
      // Set default values for optional fields if they're empty
      const variationToAdd = {
        ...newVariation,
        colorImage: newVariation.colorImage || "/placeholder.svg?height=48&width=48",
        image: newVariation.image || "/placeholder.svg?height=200&width=200",
      }

      setVariations([...variations, variationToAdd])

      // Reset the form after adding
      setNewVariation({
        color: "",
        colorCode: "#000000",
        colorImage: "",
        image: "",
      })
    } else {
      // Show error if required fields are missing
      toast({
        title: "Error",
        description: "Color name and color code are required for variations",
        variant: "destructive",
      })
    }
  }

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const handleVariationImageUpload = (url: string) => {
    setNewVariation((prev) => {
      if (prev.image === url) return prev // No need to update
      return {
        ...prev,
        image: url,
      }
    })
  }

  const handleVariationColorImageUpload = (url: string) => {
    setNewVariation((pre) => {
      return {
        ...pre,
        colorImage: url,
      }
    })
  }

  ///calll backs
  const onUploadColorComplete = useCallback((files: any) => {
    if (files.length > 0) {
      handleVariationColorImageUpload(files[0].url)
    }
  }, [])

  const onUploadVariationImageComplete = useCallback((files: any) => {
    if (files.length > 0) {
      handleVariationImageUpload(files[0].url)
    }
  }, [])

  const handleProductImageUpload = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url])
    }
  }

  const handleThumbImageUpload = (url: string) => {
    if (url && !thumbImages.includes(url)) {
      setThumbImages([...thumbImages, url])
    }
  }

  const removeThumbImage = (image) => {
    setThumbImages(thumbImages.filter((i) => i !== image))
  }

  const removeImage = (image) => {
    setImages(images.filter((i) => i !== image))
  }

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading product data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="product-slug" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty to generate automatically</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="originPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Set if the product is on sale</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity in Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="new"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as New</FormLabel>
                    <FormDescription>Display a "New" badge on this product</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as Sale</FormLabel>
                    <FormDescription>Display a "Sale" badge on this product</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Product description" className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>Sizes</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                  >
                    <span>{size}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeSize(size)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add size (e.g. S, M, L)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                />
                <Button type="button" onClick={addSize}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>Variations</FormLabel>
              <div className="space-y-4 mt-2">
                {variations.map((variation, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2 p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: variation.colorCode }}
                      ></div>
                      <span>{variation.color}</span>
                    </div>
                    <div className="flex-1 truncate">
                      <span className="text-sm text-muted-foreground">Image: {variation.image}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariation(index)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Color name (e.g. Red)"
                    value={newVariation.color}
                    onChange={(e) => setNewVariation({ ...newVariation, color: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newVariation.colorCode}
                      onChange={(e) =>
                        setNewVariation({
                          ...newVariation,
                          colorCode: e.target.value,
                        })
                      }
                      className="w-12 p-1 h-10"
                    />
                    <div className="flex-1 max-w-32 ms-10">
                      <h3>Variation Color</h3>
                      <CloudinaryUploader onUploadComplete={onUploadColorComplete} />
                    </div>
                    <div className="flex-1 max-w-32">
                      <h3>Variation Image</h3>
                      <CloudinaryUploader onUploadComplete={onUploadVariationImageComplete} />
                    </div>
                  </div>
                  <Button type="button" onClick={addVariation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variation
                  </Button>
                </div>
                <div className="flex gap-2"></div>
                {newVariation.image && (
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 border rounded-md overflow-hidden">
                      <img
                        src={newVariation.image || "/placeholder.svg"}
                        alt="Variation preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground truncate flex-1">{newVariation.image}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <FormLabel>Thumbnail Images</FormLabel>
              <div className="flex flex-wrap gap-4 mt-2">
                {thumbImages.map((image, index) => (
                  <div key={index} className="relative group w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=96&width=96"
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeThumbImage(image)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
                <div className="max-w-32 flex items-center justify-center">
                  <CloudinaryUploader
                    onUploadComplete={(files) => {
                      files.forEach((file) => {
                        handleThumbImageUpload(file.url)
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <FormLabel>Product Images</FormLabel>
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=96&width=96"
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <CloudinaryUploader
                    onUploadComplete={(files) => {
                      files.forEach((file) => {
                        handleProductImageUpload(file.url)
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
