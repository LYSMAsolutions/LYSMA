import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/atelier',
          '/atelier-dashboard',
          '/compagnons',
          '/donnees-support',
          '/double-authentification',
          '/fiches',
          '/or-externes',
          '/parametres',
          '/rapports',
          '/verification-email',
          '/vehicules',
        ],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/atelier',
          '/atelier-dashboard',
          '/compagnons',
          '/donnees-support',
          '/double-authentification',
          '/fiches',
          '/or-externes',
          '/parametres',
          '/rapports',
          '/verification-email',
          '/vehicules',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
