import type { MetadataRoute } from 'next'

const baseUrl = 'https://livo-app.com'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${baseUrl}/inscription`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/connexion`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${baseUrl}/cookies`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: `${baseUrl}/politique-confidentialite`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
]

const futureSeoRoutes: MetadataRoute.Sitemap = []

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...futureSeoRoutes]
}
