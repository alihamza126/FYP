export interface User {
    _id: string
    username: string
    email: string
    image?: string | null
    provider?: string
    providerId?: string
    isVerfied: boolean
    isAdmin: boolean
    role: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    gender?: string
    dob?: string | null
    forgotPasswordToken?: string
    forgotPasswordTokenExpiry?: string
    verifyToken?: string
    verifyTokenExpiry?: string
    usernameChangeAt?: string | null
    createdAt: string
    updatedAt: string
  }
  