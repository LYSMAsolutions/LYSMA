export const SITE_URL = 'https://www.livo-app.com'

export function canonical(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`
}
