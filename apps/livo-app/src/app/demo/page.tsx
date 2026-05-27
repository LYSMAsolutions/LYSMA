import type { Metadata } from 'next'
import { LivoDemoClient } from './LivoDemoClient'

export const metadata: Metadata = {
  title: 'Démo LIVO - Espace atelier',
  description:
    'Démo publique LIVO reproduisant le parcours atelier : sélection compagnon, code PIN, arrivée atelier, pointage et fiches de travaux.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LivoDemoPage() {
  return <LivoDemoClient />
}
