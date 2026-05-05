import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      id: "garage-login",
      name: "Garage",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Cherche le garage par email
        const garages = await prisma.$queryRaw<any[]>`
          SELECT id, name, email, "isActive"
          FROM "Garage"
          WHERE email = ${credentials.email}
          AND "isActive" = true
          LIMIT 1
        `;

        if (!garages || garages.length === 0) return null;
        const garage = garages[0];

        // Vérifie si c'est le mot de passe admin
        const adminCheck = await prisma.$queryRaw<any[]>`
          SELECT 1 FROM "Garage"
          WHERE email = ${credentials.email}
          AND "adminPassword" = crypt(${credentials.password}, "adminPassword")
          LIMIT 1
        `;

        if (adminCheck.length > 0) {
          return {
            id: garage.id,
            email: garage.email ?? "",
            name: garage.name,
            role: "ADMIN",
            garageId: garage.id,
            garageName: garage.name,
          };
        }

        // Vérifie si c'est le mot de passe atelier
        const atelierCheck = await prisma.$queryRaw<any[]>`
          SELECT 1 FROM "Garage"
          WHERE email = ${credentials.email}
          AND "atelierPassword" = crypt(${credentials.password}, "atelierPassword")
          LIMIT 1
        `;

        if (atelierCheck.length > 0) {
          return {
            id: garage.id,
            email: garage.email ?? "",
            name: garage.name,
            role: "ATELIER",
            garageId: garage.id,
            garageName: garage.name,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.garageId = (user as any).garageId;
        token.garageName = (user as any).garageName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).garageId = token.garageId;
        (session.user as any).garageName = token.garageName;
      }
      return session;
    },
  },
};