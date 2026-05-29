import type { MetadataRoute } from 'next'
import { SITE_URL, canonical } from '@/lib/seo'

const lastModified = new Date()

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: canonical('/cookies'),
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: canonical('/politique-confidentialite'),
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.2,
  },
]

const futureSeoRoutes: MetadataRoute.Sitemap = []

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...futureSeoRoutes]
}
