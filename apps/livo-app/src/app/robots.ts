import type { MetadataRoute } from 'next'

const baseUrl = 'https://livo-app.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
