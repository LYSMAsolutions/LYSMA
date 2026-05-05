import { type NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'lysma-super-admin.session-token'

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLoggedIn = req.cookies.has(SESSION_COOKIE)

  if (pathname.startsWith('/connexion')) {
    if (isLoggedIn) return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/connexion', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|preview|_next/static|_next/image|favicon.ico).*)'],
}
