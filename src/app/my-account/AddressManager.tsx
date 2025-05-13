'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Axios from '@/lib/Axios'
import toast from 'react-hot-toast'
import { Button } from '@heroui/button'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import AddressForm from './Address'

interface Address {
    _id: string
    shippingFirstName: string
    shippingLastName: string
    shippingCompany?: string
    shippingCountry: string
    shippingStreet: string
    shippingCity: string
    shippingState: string
    shippingZip: string
    shippingPhone: string
    shippingEmail: string
}

export default function AddressManager() {
    const { data: session } = useSession()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Fetch addresses
    const fetchAddresses = async () => {
        if (!session?.accessToken) return
        setLoading(true)
        try {
            const res = await Axios.get<{ addresses: Address[] }>(
                '/api/v1/address',
                { headers: { Authorization: `Bearer ${session.accessToken}` } }
            )
            setAddresses(res.data.addresses)
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to load addresses')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [session])

    const handleDelete = async (id: string) => {
        if (!session?.accessToken) {
            toast.error('Not authenticated')
            return
        }
        try {
            await Axios.delete(
                `/api/v1/address/${id}`,
                { headers: { Authorization: `Bearer ${session.accessToken}` } }
            )
            setAddresses(prev => prev.filter(addr => addr._id !== id))
            toast.success('Address deleted')
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete address')
        }
    }

    if (!session) {
        return <p>Please sign in to manage addresses.</p>
    }

    return (
        <div className="space-y-8">
            {/* Address form section */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <AddressForm
                    activeAddress="shipping"
                    onSave={() => fetchAddresses()}
                />
            </section>

            {/* Address table section */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
                {loading ? (
                    <p>Loading addresses...</p>
                ) : addresses.length === 0 ? (
                    <p>No addresses found.</p>
                ) : (
                    <div className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableColumn>First Name</TableColumn>
                                <TableColumn>Last Name</TableColumn>
                                <TableColumn>Company</TableColumn>
                                <TableColumn>Country</TableColumn>
                                <TableColumn>Street</TableColumn>
                                <TableColumn>City</TableColumn>
                                <TableColumn>State</TableColumn>
                                <TableColumn>ZIP</TableColumn>
                                <TableColumn>Phone</TableColumn>
                                <TableColumn>Email</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>

                            <TableBody>
                                {addresses.map(addr => (
                                    <TableRow key={addr._id}>
                                        <TableCell>{addr.shippingFirstName}</TableCell>
                                        <TableCell>{addr.shippingLastName}</TableCell>
                                        <TableCell>{addr.shippingCompany || '—'}</TableCell>
                                        <TableCell>{addr.shippingCountry}</TableCell>
                                        <TableCell className=' text-ellipsis line-clamp-1'>{addr.shippingStreet}</TableCell>
                                        <TableCell>{addr.shippingCity}</TableCell>
                                        <TableCell>{addr.shippingState}</TableCell>
                                        <TableCell>{addr.shippingZip}</TableCell>
                                        <TableCell>{addr.shippingPhone}</TableCell>
                                        <TableCell>{addr.shippingEmail}</TableCell>
                                        <TableCell>
                                            <Button
                                                color='danger'
                                                size="sm"
                                                onPress={() => handleDelete(addr._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </section>
        </div>
    )
}

