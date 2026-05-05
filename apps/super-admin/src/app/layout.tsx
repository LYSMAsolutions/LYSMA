import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'LYSMA Admin', template: '%s — LYSMA Admin' },
  description: 'Super Admin LYSMA Solutions',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
 