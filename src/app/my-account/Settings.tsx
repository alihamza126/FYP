'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { CloudinaryUploader } from '@/components/upload/Uploader'
import { useSession } from 'next-auth/react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Axios from '@/lib/Axios'
import { Button } from '@heroui/button'

interface SettingsProps {
    image: string | null
    firstName: string
    lastName: string
    phone: string
    gender: 'male' | 'female'
    dob: string // ISO date string
}

interface FormValues {
    avatar: string | null
    firstName: string
    lastName: string
    phone: string
    gender: 'male' | 'female'
    dob: string
}

export default function Settings({ image, firstName, lastName, phone, gender, dob }: SettingsProps) {
    const { data: session } = useSession()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            avatar: image,
            firstName,
            lastName,
            phone,
            gender,
            dob: dob ? new Date(dob).toISOString().slice(0, 10) : ''
        }
    })

    // Keep form value in sync if props change
    useEffect(() => {
        setValue('avatar', image)
        setValue('firstName', firstName)
        setValue('lastName', lastName)
        setValue('phone', phone)
        setValue('gender', gender)
        setValue('dob', dob ? new Date(dob).toISOString().slice(0, 10) : '')
    }, [image, firstName, lastName, phone, gender, dob, setValue])

    const onSubmit = async (data: FormValues) => {
        if (!session?.accessToken) {
            toast.error('You must be signed in to update settings')
            return
        }
        setIsSubmitting(true)
        try {
            await Axios.patch(
                `/api/v1/users/update/${session.user.id}`,
                data
            )
            toast.success('Settings saved successfully')
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save settings')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="heading5">Information</div>

            <div className="upload_image">
                <label className="caption1">Upload Avatar <span className="text-red">*</span></label>
                <div className="flex items-center gap-5 mt-3">
                    <div className="w-28 h-28 rounded-lg bg-surface overflow-hidden relative">
                        <Controller
                            control={control}
                            name="avatar"
                            render={({ field }) => (
                                field.value ? (
                                    <Image
                                        src={field.value}
                                        alt="avatar"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Icon.Image
                                        size={40}
                                        className="absolute inset-0 m-auto text-secondary"
                                    />
                                )
                            )}
                        />
                    </div>
                    <Controller
                        control={control}
                        name="avatar"
                        render={({ field }) => (
                            <CloudinaryUploader
                                multiple={false}
                                maxFiles={1}
                                autoUpload
                                onUploadComplete={(files) => field.onChange(files[0].url)}
                                onUploadError={(error) => toast.error(error)}
                            />
                        )}
                    />
                </div>
                {errors.avatar && <p className="text-red-500 text-xs">Avatar is required</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="caption1">First Name <span className="text-red">*</span></label>
                    <input
                        {...register('firstName', { required: 'First name is required' })}
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        type="text"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="caption1">Last Name <span className="text-red">*</span></label>
                    <input
                        {...register('lastName', { required: 'Last name is required' })}
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        type="text"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="caption1">Phone Number <span className="text-red">*</span></label>
                    <input
                        {...register('phone', { required: 'Phone is required' })}
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        type="tel"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="caption1">Gender <span className="text-red">*</span></label>
                    <div className="relative">
                        <select
                            {...register('gender', { required: 'Gender is required' })}
                            className="border-line mt-2 px-4 py-3 w-full rounded-lg appearance-none"
                        >
                            <option value="" disabled>Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <Icon.CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </div>

                <div className="sm:col-span-2">
                    <label className="caption1">Date of Birth <span className="text-red">*</span></label>
                    <input
                        {...register('dob', { required: 'DOB is required' })}
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        type="date"
                    />
                    {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                </div>
            </div>

            <div className="text-right mt-6">
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    color="primary"
                >
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
