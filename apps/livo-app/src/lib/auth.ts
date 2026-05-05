import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/connexion',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Mot de passe',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const email = parsed.data.email.toLowerCase().trim()

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            garages: {
              where: {
                actif: true,
              },
              take: 1,
            },
          },
        })

        if (!user || !user.actif || !user.passwordHash) {
          return null
        }

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)

        if (!valid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          atelierMode: false,
          garageId: user.garages[0]?.id,
        } as any
      },
    }),
  ],
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
})