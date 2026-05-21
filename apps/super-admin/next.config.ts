import type { NextConfig } from 'next'
import path from 'path'

const staticShowcaseFiles = [
  '../site-vitrine/carrosserie-mounier/index.html',
  '../site-vitrine/carrosserie-mounier/pages/**/*.html',
  '../site-vitrine/carrosserie-mounier/css/**/*.css',
  '../site-vitrine/carrosserie-mounier/js/**/*.js',
  '../site-vitrine/carrosserie-mounier/content/**/*.json',
  '../site-vitrine/carrosserie-mounier/assets/**/*.{png,jpg,jpeg,webp,gif,svg,ico,avif}',
  '../site-vitrine/lysma-hub/index.html',
]

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  outputFileTracingIncludes: {
    '/sites': staticShowcaseFiles,
    '/sites/[id]': staticShowcaseFiles,
    '/sites/[id]/studio': staticShowcaseFiles,
    '/preview/sites/[id]/[[...filePath]]': staticShowcaseFiles,
    '/api/sites/[id]/content': staticShowcaseFiles,
    '/api/sites/[id]/upload': [
      '../site-vitrine/carrosserie-mounier/assets/**/*',
      '../site-vitrine/lysma-hub/assets/**/*',
    ],
  },
  outputFileTracingExcludes: {
    '/*': [
      '../../.git/**',
      '../../.pnpm-store/**',
      '../../apps/livo-app/.next/**',
      '../../apps/livo-app/node_modules/**',
      '../../apps/livo-app/tsconfig.tsbuildinfo',
      '../../apps/portail-pma/.next/**',
      '../../apps/portail-pma/node_modules/**',
      '../../apps/portail-pma/tsconfig.tsbuildinfo',
      '../../apps/site-vitrine/**/.next/**',
      '../../apps/site-vitrine/**/node_modules/**',
      '../../apps/site-vitrine/**/tsconfig.tsbuildinfo',
      '../site-vitrine/**/.next/**',
      '../site-vitrine/**/node_modules/**',
      '../site-vitrine/**/tsconfig.tsbuildinfo',
    ],
    '/outils': [
      '../../apps/livo-app/**',
      '../../apps/portail-pma/**',
      '../../apps/site-vitrine/**',
      '../../packages/**',
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    }]
  },
}

export default nextConfig
