import canUseDOM from './canUseDOM'

const normalizeURL = (value: string): string => {
  const trimmed = value.trim().replace(/\/$/, '')
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export const getServerSideURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return normalizeURL(process.env.NEXT_PUBLIC_SERVER_URL)
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port
    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return normalizeURL(process.env.NEXT_PUBLIC_SERVER_URL)
  }

  return ''
}
