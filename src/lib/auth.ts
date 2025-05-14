"ts-nocheck"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import UserModel from "../../server/models/User.js"
import bcrypt from "bcryptjs"
import connectDB from "./connectDB"
import jwt from "jsonwebtoken"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB()

        const user = await UserModel.findOne({ email: credentials?.email })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isValid = await bcrypt.compare(credentials?.password || "", user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        // Generate a custom access token for your separate backend
        const accessToken = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1h" }, // Short expiration for access token
        )

        return {
          id: user._id.toString(),
          name: user.username,
          role: user.role,
          email: user.email,
          image: user.image,
          accessToken, // Include the access token in the user object
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        // For credentials provider, use the custom token we generated
        if (user.accessToken) {
          token.accessToken = user.accessToken
        }

        // For OAuth providers like Google, use the provider's token
        if (account?.access_token) {
          token.accessToken = account.access_token
        }

        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
        token.role = user.role
        token.provider = account?.provider || "credentials"
      }

      return token
    },

    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken

      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.image
        session.user.role = token.role
        session.user.provider = token.provider
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/register",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days for the session
  },

  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",
}

export default authOptions
