// @ts-nocheck
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import UserModel from '../../server/models/User.js'
import bcrypt from 'bcryptjs'
import connectDB from './connectDB'

const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				await connectDB()

				// Check if user exists
				const user = await UserModel.findOne({ email: credentials?.email })

				if (!user) {
					throw new Error('No user found with this email')
				}

				// Check password
				const isValid = await bcrypt.compare(
					credentials?.password || '',
					user.password,
				)

				if (!isValid) {
					throw new Error('Invalid password')
				}

				// Return user object without password
				return {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					image: user.image,
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			// Handle Google sign-in
			if (account?.provider === 'google') {
				try {
					await connectDB()

					const existingUser = await UserModel.findOne({ email: user.email })

					if (existingUser) {
						// Update existing user
						existingUser.provider = 'google'
						existingUser.providerId = profile?.sub
						existingUser.image = user.image || profile?.picture
						await existingUser.save()
						console.log('saved user old')
					} else {
						// Create new user
						await UserModel.create({
							name: user.name,
							email: user.email,
							image: user.image || profile?.picture,
							provider: 'google',
							providerId: profile?.sub,
							isProfileComplete: true,
						})
						console.log('saved user new')
					}
					console.warn('Google sign-in successful')
				} catch (error) {
					console.error('Google sign-in error:', error)
					return false
				}
			}

			// Handle credentials sign-in
			if (account?.provider === 'credentials') {
				if (!user) return false
			}

			return true
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.isProfileComplete = token.isProfileComplete as boolean
				session.user.provider = token.provider as string
			}
			return session
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id
				token.provider = account?.provider

				// Fetch additional user data for credentials login
				if (account?.provider === 'credentials') {
					await connectDB()
					const dbUser = await UserModel.findById(user.id)
					if (dbUser) {
						token.isProfileComplete = dbUser.isProfileComplete
					}
				}
			}
			return token
		},

		async redirect({ url, baseUrl }) {
			console.log(url, baseUrl)
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url
			return baseUrl
		}
	},
	pages: {
		signIn: '/login',
		error: '/error',
		newUser: '/register',
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
}

export default authOptions
