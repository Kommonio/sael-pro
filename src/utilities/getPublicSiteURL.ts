import { getServerSideURL } from './getURL'

const PRODUCTION_SITE_URL = 'https://sael.pro'

function normalizeURL(value: string) {
  const trimmed = value.trim().replace(/\/$/, '')
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** The canonical public brand URL, distinct from an internal Vercel deployment URL. */
export function getPublicSiteURL() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return normalizeURL(process.env.NEXT_PUBLIC_SITE_URL)
  if (process.env.NODE_ENV === 'production') return PRODUCTION_SITE_URL
  return getServerSideURL()
}
