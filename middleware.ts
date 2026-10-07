import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname === '/'

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/projects',
    '/dashboard/:path*',
    '/studio/:path*',
    '/bible/:path*',
    '/assets/:path*',
    '/marketing/:path*',
    '/settings/:path*',
    '/continuity/:path*',
  ],
}
