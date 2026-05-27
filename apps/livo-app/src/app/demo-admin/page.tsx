import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Démo LIVO',
  description:
    'Accès à la démonstration publique LIVO. La démo disponible présente le parcours atelier réel, sans données de production.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LivoDemoAdminPage() {
  redirect('/demo')
}
