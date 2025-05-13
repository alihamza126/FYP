'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import Axios from '@/lib/Axios'
import { useForm } from 'react-hook-form'
import { Button } from '@heroui/button'

export interface AddressFormData {
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

interface AddressFormProps {
    activeAddress: string
    onSave: () => void
}

export default function AddressForm({ activeAddress,onSave }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { data: session } = useSession()

    // initialize form with empty strings
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<AddressFormData>({
        defaultValues: {
            shippingFirstName: '',
            shippingLastName: '',
            shippingCompany: '',
            shippingCountry: '',
            shippingStreet: '',
            shippingCity: '',
            shippingState: '',
            shippingZip: '',
            shippingPhone: '',
            shippingEmail: ''
        }
    })

    // Fetch existing address on mount and populate form
    useEffect(() => {
        if (!session?.accessToken) return
        const fetchAddress = async () => {
            try {
                const res = await Axios.get<AddressFormData>(
                    `/api/v1/address`,
                    {
                        headers: { Authorization: `Bearer ${session.accessToken}` }
                    }
                )
                const data = res.data
                // populate form fields
                Object.entries(data).forEach(([key, value]) => {
                    setValue(key as keyof AddressFormData, value as string)
                })
            } catch (err: any) {
                console.log(err)
                toast.error(err.response?.data?.error || 'Could not load address')
            }
        }
        fetchAddress()
    }, [session, setValue])

    const onSubmit = async (data: AddressFormData) => {
        if (!session?.accessToken) {
            toast.error('You must be signed in to save an address')
            return
        }
        setIsSubmitting(true)
        try {
            await Axios.post(
                '/api/v1/address',
                data,
                { headers: { Authorization: `Bearer ${session.accessToken}` } }
            )
            onSave()
            toast.success('Address saved successfully')
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save address')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={() => onSubmit}

            className={activeAddress === 'shipping' ? 'block' : 'hidden'}
        >
            <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                {/* First Name */}
                <div>
                    <label htmlFor="shippingFirstName" className="caption1 capitalize">
                        First Name <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingFirstName"
                        {...register('shippingFirstName', { required: 'First name is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingFirstName ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingFirstName && (
                        <p className="text-red text-sm mt-1">{errors.shippingFirstName.message}</p>
                    )}
                </div>
                {/* Last Name */}
                <div>
                    <label htmlFor="shippingLastName" className="caption1 capitalize">
                        Last Name <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingLastName"
                        {...register('shippingLastName', { required: 'Last name is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingLastName ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingLastName && (
                        <p className="text-red text-sm mt-1">{errors.shippingLastName.message}</p>
                    )}
                </div>
                {/* Company */}
                <div>
                    <label htmlFor="shippingCompany" className="caption1 capitalize">
                        Company Name (optional)
                    </label>
                    <input
                        id="shippingCompany"
                        {...register('shippingCompany')}
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                    />
                </div>
                {/* Country */}
                <div>
                    <label htmlFor="shippingCountry" className="caption1 capitalize">
                        Country / Region <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingCountry"
                        {...register('shippingCountry', { required: 'Country is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingCountry ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingCountry && (
                        <p className="text-red text-sm mt-1">{errors.shippingCountry.message}</p>
                    )}
                </div>
                {/* Street */}
                <div>
                    <label htmlFor="shippingStreet" className="caption1 capitalize">
                        Street Address <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingStreet"
                        {...register('shippingStreet', { required: 'Street address is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingStreet ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingStreet && (
                        <p className="text-red text-sm mt-1">{errors.shippingStreet.message}</p>
                    )}
                </div>
                {/* City */}
                <div>
                    <label htmlFor="shippingCity" className="caption1 capitalize">
                        Town / City <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingCity"
                        {...register('shippingCity', { required: 'City is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingCity ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingCity && (
                        <p className="text-red text-sm mt-1">{errors.shippingCity.message}</p>
                    )}
                </div>
                {/* State */}
                <div>
                    <label htmlFor="shippingState" className="caption1 capitalize">
                        State <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingState"
                        {...register('shippingState', { required: 'State is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingState ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingState && (
                        <p className="text-red text-sm mt-1">{errors.shippingState.message}</p>
                    )}
                </div>
                {/* ZIP */}
                <div>
                    <label htmlFor="shippingZip" className="caption1 capitalize">
                        ZIP <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingZip"
                        {...register('shippingZip', { required: 'ZIP code is required' })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingZip ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingZip && (
                        <p className="text-red text-sm mt-1">{errors.shippingZip.message}</p>
                    )}
                </div>
                {/* Phone */}
                <div>
                    <label htmlFor="shippingPhone" className="caption1 capitalize">
                        Phone <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingPhone"
                        {...register('shippingPhone', {
                            required: 'Phone is required',
                            pattern: { value: /^[+\d][\d\s-]+$/, message: 'Invalid phone number' }
                        })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingPhone ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingPhone && (
                        <p className="text-red text-sm mt-1">{errors.shippingPhone.message}</p>
                    )}
                </div>
                {/* Email */}
                <div>
                    <label htmlFor="shippingEmail" className="caption1 capitalize">
                        Email <span className="text-red">*</span>
                    </label>
                    <input
                        id="shippingEmail"
                        type="email"
                        {...register('shippingEmail', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                        })}
                        className={`border-line mt-2 px-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue ${errors.shippingEmail ? 'border-red' : ''
                            }`}
                    />
                    {errors.shippingEmail && (
                        <p className="text-red text-sm mt-1">{errors.shippingEmail.message}</p>
                    )}
                </div>
            </div>

            <div className="block-button lg:mt-10 mt-6">
                <Button type="submit" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} color='primary'>
                    Save
                </Button>
            </div>
        </form>
    )
}


