
// app/my-account/page.tsx
import React from 'react'
import MyAccount from './Account'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'
import { redirect } from 'next/navigation'
import axios from 'axios'

export default async function Page() {
    // 1. Ensure the user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }

    // 2. Fetch user data from your backend
    let userData = null
    try {
        const response = await axios.get(
            `${process.env.NEXTAUTH_URL}/api/v1/users/me/${session.user.id}`,
            {
                headers: {
                    // Forward the NextAuth token for server-to-server auth
                    Authorization: `Bearer ${session.accessToken}`,
                },
                // Include credentials in case your API relies on cookies
                withCredentials: true,
            }
        )
        userData = response.data.user
    } catch (err: any) {
        console.error('Failed to fetch user data:', err)
        // Optionally redirect or show an error UI
        redirect('/error')
    }

    // 3. Render your account page
    return (
        <div className="">
            <MyAccount userData={userData} />
        </div>
    )
}

