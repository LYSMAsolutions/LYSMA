import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

const PUBLIC_ROUTES = ['/connexion', '/inscription', '/atelier-login', '/abonnement-expire', '/politique-confidentialite']
const ATELIER_ROUTES = ['/atelier-dashboard']
const TRIAL_EXEMPT = ['/abonnement-expire', '/connexion', '/inscription', '/politique-confidentialite']

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const atelierCookie = req.cookies.get('atelier-garage-id')?.value

  // Routes publiques → toujours ok
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    if (isLoggedIn && pathname === '/connexion') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Routes atelier → cookie atelier requis
  if (ATELIER_ROUTES.some(r => pathname.startsWith(r))) {
    if (!atelierCookie) return NextResponse.redirect(new URL('/atelier-login', req.url))
    return NextResponse.next()
  }

  // Routes admin → session NextAuth requise
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/connexion', req.url))
  }

  // Vérification trial (seulement pour les routes admin connectées)
  if (!TRIAL_EXEMPT.some(r => pathname.startsWith(r)) && req.auth?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.auth.user.id },
        include: { garages: { take: 1, select: { trialEndsAt: true, abonnementActif: true } } },
      })
      const garage = user?.garages[0]
      if (garage && !garage.abonnementActif && garage.trialEndsAt) {
        if (new Date() > new Date(garage.trialEndsAt)) {
          return NextResponse.redirect(new URL('/abonnement-expire', req.url))
        }
      }
    } catch {
      // Ne pas bloquer si DB inaccessible
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|design).*)'],
}
