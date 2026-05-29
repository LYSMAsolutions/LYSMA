import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Cookies — LIVO',
  description: 'Gestion du consentement aux cookies strictement nécessaires au fonctionnement de LIVO.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: canonical('/cookies'),
  },
}

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
