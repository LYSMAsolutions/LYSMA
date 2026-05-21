import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'lysma-super-admin.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/connexion',
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const parsed = schema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const admin = await prisma.adminUser.findUnique({
          where: {
            email: parsed.data.email,
          },
        })

        if (!admin) {
          return null
        }

        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash)

        if (!valid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.nom,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }

      return session
    },
  },
})
