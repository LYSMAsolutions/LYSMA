import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Connexion — LIVO',
  description: 'Connexion sécurisée à votre espace LIVO.',
  alternates: {
    canonical: canonical('/connexion'),
  },
}

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children
}
