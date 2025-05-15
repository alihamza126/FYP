'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link';
import Footer from '@/components/Footer/Footer'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import TopNavThree from '@/components/Header/TopNav/TopNavThree'

export default function OrderSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const totalParam = params.get('totalAmount')
  const paymentIntentId = params.get('payment_intent')

  // Redirect if missing params
  useEffect(() => {
    if (!totalParam || !paymentIntentId) {
      router.replace('/')
    }
  }, [totalParam, paymentIntentId, router])

  // Parse amount in cents to dollars
  const amount = totalParam ? parseFloat(totalParam).toFixed(0) : '0.00'

  return (
    <>
      <div id="header" className='relative w-full border-b border-foreground-300'>
        <TopNavThree props="style-three bg-white" />
        <MenuTwo />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-white rounded-3xl shadow-2xl shadow-success-300 p-10 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <CheckCircle className="mx-auto text-success-500" size={72} />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-6 text-3xl font-extrabold  text-success-500 "
            >
              Payment Successful!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-4 text-gray-600"
            >
              <span className=' font-semibold mx-2'>You have paid</span> <span className="font-medium text-secondary-700">PKR {amount}</span>
            </motion.p>


            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="mt-8"
            >
              <Link href="/"
                className="inline-block px-6 py-3 bg-success text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </>
  )
}
