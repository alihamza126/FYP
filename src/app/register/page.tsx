'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, FormData } from '@/lib/validatoins'

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await toast.promise(
        axios.post('/api/v1/users/register', data),
        {
          loading: 'Registering your account...',
          success: 'Registration successful! Please verify your email.',
          error: (err) => {
            const msg = err?.response?.data?.error
            if (msg?.toLowerCase().includes('user already exists')) {
              return 'This email is already registered.'
            }
            return msg || 'Registration failed. Try again.'
          },
        }
      )
      reset()
    } catch {
      // handled by toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Create An Account" subHeading="Create An Account" />
      </div>
      <div className="register-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
              <div className="heading4">Register</div>
              <form onSubmit={handleSubmit(onSubmit)} className="md:mt-7 mt-4 space-y-5">
                {/* Username */}
                <div>
                  <input
                    type="text"
                    placeholder="Username *"
                    disabled={isLoading}
                    autoComplete='false'
                    autoCorrect='false'
                    className="border-line px-4 py-3 w-full rounded-lg"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && <p className="text-red text-sm mt-1">{errors.username.message}</p>}
                </div>
                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email address *"
                    disabled={isLoading}
                    className="border-line px-4 py-3 w-full rounded-lg"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-red text-sm mt-1">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password *"
                    disabled={isLoading}
                    className="border-line px-4 py-3 w-full rounded-lg"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <Icon.Eye
                    size={24}
                    className="absolute z-30 right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                  {errors.password && <p className="text-red text-sm mt-1">{errors.password.message}</p>}
                </div>
                {/* Confirm Password */}
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password *"
                    disabled={isLoading}
                    className="border-line px-4 py-3 w-full rounded-lg"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === watch('password') || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && <p className="text-red text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    disabled={isLoading}
                    className="mr-2"
                    {...register('agreeTerms', { required: 'You must agree to terms' })}
                  />
                  <label htmlFor="terms" className="text-secondary2">
                    I agree to the{' '}
                    <Link href="#!" className="text-black hover:underline">
                      Terms of Use
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>}
                <button
                  disabled={isLoading}
                  className="button-main w-full py-3"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <p className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience, saved preferences, and more.
                </p>
                <Link href="/login" className="button-main mt-4 inline-block">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Register
