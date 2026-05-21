import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  outputFileTracingIncludes: {
    '/sites': ['../site-vitrine/**/*'],
    '/sites/[id]': ['../site-vitrine/**/*'],
    '/sites/[id]/studio': ['../site-vitrine/**/*'],
    '/preview/sites/[id]/[[...filePath]]': ['../site-vitrine/**/*'],
    '/api/sites/[id]/content': ['../site-vitrine/**/*'],
    '/api/sites/[id]/upload': ['../site-vitrine/**/*'],
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
