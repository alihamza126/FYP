import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { publicPages } from '@/utils/publicpath'


// Initialize NextAuth middleware
default const authMiddleware = withAuth(
  (req) => NextResponse.next(),
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = (req as any).nextauth?.token


  if (
    publicPages.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    )
  ) {
    return NextResponse.next()
  }

  // Admin-only routes: requires token.role === 'admin'
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.next()
  }

  // All other routes: require authentication
  return authMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|.*\\..*).*)',
  ],
}