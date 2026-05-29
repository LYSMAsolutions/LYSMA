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
          '/fiches',
          '/parametres',
          '/rapports',
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
          '/fiches',
          '/parametres',
          '/rapports',
          '/vehicules',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
