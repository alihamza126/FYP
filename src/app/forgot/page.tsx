'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

const PageForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: '' }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [serverState, setServerState] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerState(null)
    try {
      const res = await fetch('/api/v1/users/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })
      const body = await res.json()

      if (res.ok && body.success) {
        setServerState({ type: 'success', message: body.message })
        toast.success(body.message)
      } else {
        setServerState({ type: 'error', message: body.error || 'Something went wrong' })
        toast.error(body.error || 'Something went wrong')
      }
    } catch {
      setServerState({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface2 flex flex-col">
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Forgot Password" subHeading="Enter your email to reset password" />
      </div>
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black">Forgot Password</h2>

          {serverState && (
            <div
              className={`mb-4 px-4 py-3 rounded text-sm ${serverState.type === 'success' ? 'bg-success/20 text-success' : 'bg-red/20 text-red'
                }`}
            >
              {serverState.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-secondary2 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                autoComplete="off"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${errors.email
                    ? 'border-red focus:ring-red'
                    : 'border-line focus:ring-purple'
                  }`}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple hover:bg-purple/90 text-white font-medium py-2 rounded transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-center text-secondary">
            Remembered your password?{' '}
            <Link href="/login" className="text-purple hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PageForgotPassword
