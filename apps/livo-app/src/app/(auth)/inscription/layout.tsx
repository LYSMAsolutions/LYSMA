import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Créer un compte — LIVO',
  description: 'Créez votre compte LIVO pour essayer le logiciel de pointage atelier.',
  alternates: {
    canonical: canonical('/inscription'),
  },
}

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return children
}
