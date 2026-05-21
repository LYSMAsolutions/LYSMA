import type { NextAuthConfig } from 'next-auth'

export default {
  pages: {
    signIn: '/connexion',
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'livo-app.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.atelierMode = (user as any).atelierMode ?? false
        token.garageId = (user as any).garageId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session as any).atelierMode = token.atelierMode
        ;(session as any).garageId = token.garageId
      }
      return session
    },
  },
} satisfies NextAuthConfig
