import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { CookieBanner } from '@/components/layout/CookieBanner/CookieBanner'
import { LivoChatbox } from '@/components/layout/LivoChatbox'
import { SITE_URL } from '@/lib/seo'
import { PublicSiteShell } from './PublicSiteShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LIVO - Logiciel pointage garage et atelier',
    template: '%s - LIVO',
  },
  description:
    "Application web de pointage atelier, suivi des fiches, compagnons, véhicules, temps réel et écarts opérationnels pour garages et carrosseries.",
  icons: {
    icon: '/logo/livo-app-logo.png',
    apple: '/logo/livo-app-logo.png',
  },
  applicationName: 'Livo-app',
  keywords: [
    'logiciel pointage garage',
    'pointage atelier',
    'pointage OR',
    'ordre de réparation garage',
    'logiciel garage Dordogne',
    'logiciel carrosserie',
    'logiciel MRA',
    'API QR code garage',
    'rentabilité atelier',
  ],
  authors: [{ name: 'LYSMA Solutions' }],
  creator: 'LYSMA Solutions',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Livo-app',
    title: 'LIVO - Logiciel pointage garage et atelier',
    description:
      'Pointage atelier, fiches de travail, compagnons, véhicules, temps réel et rapports pour garages et carrosseries.',
  },
  robots: {
    index: true,
    follow: true,
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
        <PublicSiteShell>{children}</PublicSiteShell>
        <CookieBanner />
        <LivoChatbox />
      </body>
    </html>
  )
}
