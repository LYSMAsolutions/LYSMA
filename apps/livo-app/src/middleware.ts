import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/connexion', '/inscription', '/atelier-login', '/abonnement-expire', '/politique-confidentialite', '/cookies']
const ATELIER_ROUTES = ['/atelier-dashboard']
const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const atelierCookie = req.cookies.get('atelier-garage-id')?.value

  if (PUBLIC_ROUTES.some((route) => pathname === route || (route !== '/' && pathname.startsWith(route)))) {
    if (isLoggedIn && pathname === '/connexion') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  if (ATELIER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!atelierCookie) return NextResponse.redirect(new URL('/atelier-login', req.url))
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/connexion', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|design).*)'],
}
