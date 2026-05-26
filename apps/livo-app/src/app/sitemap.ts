import type { MetadataRoute } from 'next'

const baseUrl = 'https://livo-app.com'
const lastModified = new Date()

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${baseUrl}/inscription`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/connexion`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${baseUrl}/cookies`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: `${baseUrl}/politique-confidentialite`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.2,
  },
]

const futureSeoRoutes: MetadataRoute.Sitemap = []

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...futureSeoRoutes]
}
