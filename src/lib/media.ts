export type MediaDoc = {
  id?: string | number | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  kind?: 'auto' | 'image' | 'video' | 'diagram' | 'captions' | null
  purpose?: 'informative' | 'decorative' | null
  rightsConfirmed?: boolean | null
  alt?: string | null
  credit?: string | null
  creditUrl?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: { url?: string | null }
    small?: { url?: string | null }
    medium?: { url?: string | null }
    large?: { url?: string | null }
    xlarge?: { url?: string | null }
    og?: { url?: string | null }
  } | null
  focalX?: number | null
  focalY?: number | null
  poster?: MediaDoc | number | null
}

function normalizePublicUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  let next = url.startsWith('/') ? url : `/${url}`
  next = next.replace(/^\/(en|fr)(?=\/)/, '')
  const still = next.match(/^\/(?:work|stills)\/([^/]+)\.(png|jpe?g|webp|gif|avif)$/i)
  if (still) return `/stills/${still[1]}.jpg`
  return next
}

export function mediaUrl(media?: MediaDoc | number | null, size?: keyof NonNullable<MediaDoc['sizes']>) {
  if (!media || typeof media === 'number') return null
  if (size && media.sizes?.[size]?.url) return normalizePublicUrl(media.sizes[size]?.url)
  return normalizePublicUrl(media.url)
}

export function focalPoint(media?: MediaDoc | number | null) {
  if (!media || typeof media === 'number') return '50% 50%'
  const x = media.focalX ?? 50
  const y = media.focalY ?? 50
  return `${x}% ${y}%`
}

export function isVideoMedia(media?: MediaDoc | number | null) {
  if (!media || typeof media === 'number') return false
  return media.kind === 'video' || Boolean(media.mimeType?.toLowerCase().startsWith('video/'))
}
