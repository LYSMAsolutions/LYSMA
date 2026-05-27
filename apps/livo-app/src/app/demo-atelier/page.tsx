import type { Metadata } from 'next'
import { LivoDemoClient } from '../demo/LivoDemoClient'

export const metadata: Metadata = {
  title: 'Démo atelier LIVO',
  description:
    'Démo publique du mode atelier LIVO : sélection du compagnon, code PIN, arrivée atelier, pointage et fiches de travaux.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LivoDemoAtelierPage() {
  return <LivoDemoClient />
}
