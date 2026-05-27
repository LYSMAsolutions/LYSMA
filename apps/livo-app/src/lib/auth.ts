import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import authConfig from '@/auth.config'
import { SecurityAuditEvent } from '@prisma/client'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { requestIp, requestUserAgent, writeSecurityAuditLog } from '@/lib/security/audit'
import { decryptSecret } from '@/lib/security/crypto'
import { verifyTotpCode } from '@/lib/security/totp'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  twoFactorCode: z.string().optional(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const email = parsed.data.email.toLowerCase().trim()
        const headers = new Headers((request as any)?.headers)
        const ip = requestIp(headers)
        const userAgent = requestUserAgent(headers)
        const rate = await checkRateLimit({
          key: `login:${ip ?? 'unknown'}:${email}`,
          limit: 8,
          windowSeconds: 60 * 15,
          blockSeconds: 60 * 20,
        })
        if (!rate.allowed) {
          await writeSecurityAuditLog({
            event: SecurityAuditEvent.LOGIN_FAILED,
            ip,
            userAgent,
            metadata: { reason: 'rate_limited', email },
          })
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            garages: {
              where: { actif: true },
              orderBy: { createdAt: 'asc' },
              take: 1,
            },
          },
        })

        if (!user || !user.actif || !user.passwordHash) {
          await writeSecurityAuditLog({
            event: SecurityAuditEvent.LOGIN_FAILED,
            ip,
            userAgent,
            metadata: { reason: 'invalid_user', email },
          })
          return null
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await writeSecurityAuditLog({
            event: SecurityAuditEvent.LOGIN_FAILED,
            userId: user.id,
            ip,
            userAgent,
            metadata: { reason: 'locked' },
          })
          return null
        }

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) {
          const failedLoginCount = user.failedLoginCount + 1
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount,
              lockedUntil: failedLoginCount >= 10 ? new Date(Date.now() + 20 * 60_000) : null,
            },
          })
          await writeSecurityAuditLog({
            event: SecurityAuditEvent.LOGIN_FAILED,
            userId: user.id,
            ip,
            userAgent,
            metadata: { reason: 'invalid_password' },
          })
          return null
        }

        if (!user.emailVerified && !user.emailVerifiedAt) {
          await writeSecurityAuditLog({
            event: SecurityAuditEvent.LOGIN_BLOCKED_EMAIL_UNVERIFIED,
            userId: user.id,
            ip,
            userAgent,
          })
          return null
        }

        if (user.twoFactorEnabled) {
          if (!user.twoFactorSecretEncrypted || !parsed.data.twoFactorCode) {
            await writeSecurityAuditLog({
              event: SecurityAuditEvent.TWO_FACTOR_FAILED,
              userId: user.id,
              ip,
              userAgent,
              metadata: { reason: 'missing_code' },
            })
            return null
          }

          const validTotp = verifyTotpCode(decryptSecret(user.twoFactorSecretEncrypted), parsed.data.twoFactorCode)
          if (!validTotp) {
            await writeSecurityAuditLog({
              event: SecurityAuditEvent.TWO_FACTOR_FAILED,
              userId: user.id,
              ip,
              userAgent,
              metadata: { reason: 'invalid_code' },
            })
            return null
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
          },
        })

        await writeSecurityAuditLog({
          event: SecurityAuditEvent.LOGIN_SUCCESS,
          userId: user.id,
          ip,
          userAgent,
        })

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          emailVerifiedAt: user.emailVerifiedAt ?? user.emailVerified,
          sessionVersion: user.sessionVersion,
          atelierMode: false,
          garageId: user.garages[0]?.id,
        } as any
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.emailVerifiedAt = (user as any).emailVerifiedAt
          ? new Date((user as any).emailVerifiedAt).toISOString()
          : null
        token.sessionVersion = (user as any).sessionVersion ?? 1
        token.atelierMode = (user as any).atelierMode ?? false
        token.garageId = (user as any).garageId
        return token
      }

      if (token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            actif: true,
            role: true,
            emailVerified: true,
            emailVerifiedAt: true,
            sessionVersion: true,
          },
        })

        const verifiedAt = freshUser?.emailVerifiedAt ?? freshUser?.emailVerified ?? null
        token.active = !!freshUser?.actif
        token.role = freshUser?.role
        token.emailVerifiedAt = verifiedAt ? verifiedAt.toISOString() : null
        token.sessionVersion = freshUser?.sessionVersion ?? 0
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const accountIsUsable = token.active !== false && Boolean(token.emailVerifiedAt)
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session.user as any).emailVerifiedAt = token.emailVerifiedAt
        ;(session as any).atelierMode = token.atelierMode
        ;(session as any).garageId = token.garageId
        ;(session as any).active = token.active !== false

        if (!accountIsUsable) {
          session.user.id = ''
        }
      }
      return session
    },
  },
})
