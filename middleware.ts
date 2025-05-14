import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { publicPages } from '@/utils/publicpath'

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    console.log(req.nextauth?.token)
    // Allow public paths
    if (
      publicPages.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
      )
    ) {
      return NextResponse.next()
    }

    // Admin-only routes
    // console.log()
    const token = req?.nextauth?.token
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // All other authenticated routes
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Auth required for non-public routes
    },
    pages: {
      signIn: '/login',
      error: '/unauthorized',
      verifyRequest: '/unauthorized',
      newUser: '/unauthorized',
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next|_static|.*\\..*).*)'],
}
