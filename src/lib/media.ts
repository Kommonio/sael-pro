export type MediaDoc = {
  url?: string | null
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
}

export function mediaUrl(media?: MediaDoc | number | null, size?: keyof NonNullable<MediaDoc['sizes']>) {
  if (!media || typeof media === 'number') return null
  if (size && media.sizes?.[size]?.url) return media.sizes[size]?.url || null
  return media.url || null
}

export function focalPoint(media?: MediaDoc | number | null) {
  if (!media || typeof media === 'number') return '50% 50%'
  const x = media.focalX ?? 50
  const y = media.focalY ?? 50
  return `${x}% ${y}%`
}
