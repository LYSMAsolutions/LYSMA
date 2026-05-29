import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { CookieBanner } from '@/components/layout/CookieBanner/CookieBanner'
import { SITE_URL } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Livo-app',
    template: '%s — LIVO',
  },
  description: "Gestion d'atelier automobile. Simple, précise et sécurisée.",
  icons: {
    icon: '/logo/livo-app-logo.png',
    apple: '/logo/livo-app-logo.png',
  },
  applicationName: 'Livo-app',
  keywords: ['garage', 'atelier', 'mécanique', 'pointage', 'gestion RH'],
  authors: [{ name: 'LYSMA Solutions' }],
  creator: 'LYSMA Solutions',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Livo-app',
    title: "Livo-app — Gestion d'atelier automobile",
    description: 'Pointage, ordres de réparation, rentabilité. Fait pour le garage.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#04060f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
