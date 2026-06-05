import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = new Set([
  '/',
  '/connexion',
  '/inscription',
  '/atelier-login',
  '/demo',
  '/demo-admin',
  '/demo-atelier',
  '/abonnement-expire',
  '/logiciel-pointage-garage-dordogne',
  '/api-qr-ordre-reparation-garage',
  '/conformite-temps-travail',
  '/politique-confidentialite',
  '/cookies',
  '/verification-email',
  '/verification-email/envoye',
  '/sitemap.xml',
  '/robots.txt',
])
const ATELIER_ROUTES = ['/atelier-dashboard']
const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const atelierCookie = req.cookies.get('atelier-garage-id')?.value

  if (process.env.NODE_ENV === 'production' && req.nextUrl.hostname === 'livo-app.com') {
    const url = req.nextUrl.clone()
    url.hostname = 'www.livo-app.com'
    return NextResponse.redirect(url, 308)
  }

  if (PUBLIC_ROUTES.has(pathname)) {
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
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo|design).*)'],
}
