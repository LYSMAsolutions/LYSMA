import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { CookieBanner } from '@/components/layout/CookieBanner/CookieBanner'

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
  description: "Gestion d'atelier automobile. Simple. Précis. Légal.",
  icons: {
    icon: '/logo/livo-app-logo.png',
    apple: '/logo/livo-app-logo.png',
  },
  applicationName: 'Livo-app',
  keywords: ['garage', 'atelier', 'mécanique', 'pointage', 'gestion RH'],
  authors: [{ name: 'LYSMA Solutions' }],
  creator: 'LYSMA Solutions',
  metadataBase: new URL('https://livo-app.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://livo-app.com',
    siteName: 'Livo-app',
    title: 'Livo-app — Gestion d\'atelier automobile',
    description: "Pointage, ordres de réparation, rentabilité. Fait pour le garage.",
  },
  robots: {
    index: false, // SaaS privé — pas d'indexation des espaces connectés.
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Désactive le zoom pour une interface tablette/tactile stable.
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
