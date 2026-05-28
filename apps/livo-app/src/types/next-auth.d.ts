import 'next-auth'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      role?: string
      emailVerifiedAt?: string | null
      twoFactorEnabled?: boolean
    } & DefaultSession['user']
    active?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    emailVerifiedAt?: string | null
    twoFactorEnabled?: boolean
    sessionVersion?: number
    active?: boolean
    atelierMode?: boolean
    garageId?: string
  }
}
