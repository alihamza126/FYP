'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Axios from '@/lib/Axios'
import { CloudinaryUploader } from '@/components/upload/Uploader'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import Image from 'next/image'

interface Slider {
    _id: string
    title: string
    content: string
    image: string
    category: string
}

interface SliderForm {
    title: string
    content: string
    image: string
    category: string
}

export default function SliderManager() {
    const [sliders, setSliders] = useState<Slider[]>([])
    const [selected, setSelected] = useState<Slider | null>(null)
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const form = useForm<SliderForm>({
        defaultValues: { title: '', content: '', image: '', category: '' }
    });


    const [categories, setCategories] = useState([])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await Axios.get("/api/v1/category")
            const data = response.data.categories
            setCategories(data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSliders = async () => {
        try {
            const res = await Axios.get<{ sliders: Slider[] }>('/api/v1/slider')
            setSliders(res.data.sliders)
        } catch (err) {
            toast.error('Failed to load sliders')
        }
    }

    useEffect(() => {
        fetchSliders();
        fetchCategories();
    }, [])

    const onSubmit = async (data: SliderForm) => {
        console.log(data)

        try {
            if (selected) {

                Axios.put(`/api/v1/slider/${selected._id}`, data)
                toast.success('Slider updated')
            } else {
                Axios.post('/api/v1/slider', data)
                toast.success('Slider created')
            }
            setOpen(false)
            form.reset()
            setSelected(null)
            fetchSliders();
        } catch (err) {
            toast.error('Operation failed')
        }
    }

    const handleEdit = (slider: Slider) => {
        setSelected(slider)
        form.reset({
            title: slider.title,
            content: slider.content,
            image: slider.image,
            category: slider.category
        })
        setOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {

            await Axios.delete(`/api/v1/slider/${id}`)
            toast.success('Slider deleted')
            fetchSliders()
        } catch {
            toast.error('Delete failed')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Slider Management</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Slider</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{selected ? 'Edit Slider' : 'New Slider'}</DialogTitle>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm">Title</label>
                                <Input {...form.register('title', { required: true })} />
                            </div>
                            <div>
                                <label className="block text-sm">Content</label>
                                <Textarea {...form.register('content', { required: true })} />
                            </div>
                            <div>
                                <CloudinaryUploader
                                    maxFiles={1}
                                    onUploadComplete={(files) => {
                                        if (!files || files.length === 0) return
                                        const url = files[0].url
                                        form.setValue('image', url)
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm py-1">Category</label>
                                <Select required onValueChange={(value) => form.setValue('category', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                categories.map((c) => (
                                                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => { setOpen(false); setSelected(null); form.reset() }}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {selected ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>


            <Table  aria-label="category" border={false}>
                <TableHeader>
                    <TableColumn>Image</TableColumn>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Content</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {sliders.map((s) => (
                        <TableRow key={s._id}>
                            <TableCell><Image alt='' className='rounded-xl' src={s.image} height={50} width={100} /></TableCell>
                            <TableCell>{s.title}</TableCell>
                            <TableCell>{s.content}</TableCell>
                            <TableCell>{s.category}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(s)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(s._id)}>Delete</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
