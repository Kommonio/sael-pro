import type { MediaDoc } from '@/lib/media'

export const VIDEO_SOURCE_TYPES = ['upload', 'vimeo', 'youtube'] as const

export type VideoSourceType = (typeof VIDEO_SOURCE_TYPES)[number]
export type VideoAspectRatio = '16:9' | '4:3' | '1:1' | '9:16'

export type ProjectVideoRecord = {
  source?: VideoSourceType | null
  asset?: MediaDoc | number | null
  url?: string | null
  title?: string | null
  caption?: string | null
  poster?: MediaDoc | number | null
  tracks?: readonly {
    file?: MediaDoc | number | null
    kind?: 'captions' | 'subtitles' | null
    language?: 'en' | 'fr' | null
    label?: string | null
    default?: boolean | null
    id?: string | number | null
  }[] | null
  startAt?: number | null
  aspectRatio?: VideoAspectRatio | null
  id?: string | number | null
}

export type ProjectVideo = {
  source: VideoSourceType
  asset: MediaDoc | number | null
  url: string | null
  title: string
  caption: string | null
  poster: MediaDoc | number | null
  tracks: {
    file: MediaDoc | number
    kind: 'captions' | 'subtitles'
    language: 'en' | 'fr'
    label: string
    default: boolean
    id: string | number | null
  }[]
  startAt: number
  aspectRatio: VideoAspectRatio
  id: string | number | null
}

type ParsedExternalVideo = {
  provider: Exclude<VideoSourceType, 'upload'>
  id: string
  hash?: string
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/
const VIMEO_ID = /^\d{1,12}$/

function clean(value?: string | null) {
  return value?.trim() || ''
}

function asUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function youtubeIdFromUrl(url: URL) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || ''
  if (!['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
    return ''
  }
  if (url.pathname === '/watch') return url.searchParams.get('v') || ''
  const [prefix, id] = url.pathname.split('/').filter(Boolean)
  return ['embed', 'shorts', 'live'].includes(prefix) ? id || '' : ''
}

function vimeoPartsFromUrl(url: URL) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (!['vimeo.com', 'player.vimeo.com'].includes(host)) return null
  const segments = url.pathname.split('/').filter(Boolean)
  const videoIndex = segments[0] === 'video' ? 1 : segments.findIndex((part) => VIMEO_ID.test(part))
  const id = segments[videoIndex]
  if (!id || !VIMEO_ID.test(id)) return null
  const pathHash = segments[videoIndex + 1]
  const queryHash = url.searchParams.get('h') || ''
  const hash = clean(queryHash || pathHash)
  return { id, hash: /^[A-Za-z0-9]+$/.test(hash) ? hash : undefined }
}

export function parseExternalVideo(
  provider: Exclude<VideoSourceType, 'upload'>,
  value?: string | null,
): ParsedExternalVideo | null {
  const input = clean(value)
  if (!input) return null

  if (provider === 'youtube' && YOUTUBE_ID.test(input)) {
    return { provider, id: input }
  }
  if (provider === 'vimeo' && VIMEO_ID.test(input)) {
    return { provider, id: input }
  }

  const url = asUrl(input)
  if (!url || url.protocol !== 'https:') return null

  if (provider === 'youtube') {
    const id = youtubeIdFromUrl(url)
    return YOUTUBE_ID.test(id) ? { provider, id } : null
  }

  const parts = vimeoPartsFromUrl(url)
  return parts ? { provider, ...parts } : null
}

export function validateExternalVideoUrl(
  provider: Exclude<VideoSourceType, 'upload'>,
  value?: string | null,
) {
  if (parseExternalVideo(provider, value)) return true
  return provider === 'youtube'
    ? 'Paste a valid HTTPS YouTube URL or 11-character video ID.'
    : 'Paste a valid HTTPS Vimeo URL or numeric video ID.'
}

function safeStartAt(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.max(0, Math.floor(value))
}

export function externalVideoEmbedUrl(
  provider: Exclude<VideoSourceType, 'upload'>,
  value?: string | null,
  startAt?: number | null,
) {
  const parsed = parseExternalVideo(provider, value)
  if (!parsed) return null
  const start = safeStartAt(startAt)

  if (provider === 'youtube') {
    const params = new URLSearchParams({ rel: '0' })
    if (start) params.set('start', String(start))
    return `https://www.youtube-nocookie.com/embed/${parsed.id}?${params}`
  }

  const params = new URLSearchParams({ dnt: '1' })
  if (parsed.hash) params.set('h', parsed.hash)
  if (start) params.set('#t', `${start}s`)
  const query = [...params.entries()]
    .filter(([key]) => key !== '#t')
    .map(([key, valuePart]) => `${encodeURIComponent(key)}=${encodeURIComponent(valuePart)}`)
    .join('&')
  const fragment = start ? `#t=${start}s` : ''
  return `https://player.vimeo.com/video/${parsed.id}?${query}${fragment}`
}

export function normalizeProjectVideos(source?: {
  title?: string | null
  video?: MediaDoc | number | null
  videos?: readonly ProjectVideoRecord[] | null
} | null): ProjectVideo[] {
  const records = source?.videos || []
  if (records.length) {
    return records.map((record) => ({
      source: record.source || 'upload',
      asset: record.asset ?? null,
      url: clean(record.url) || null,
      title: clean(record.title) || clean(source?.title) || 'Project video',
      caption: clean(record.caption) || null,
      poster: record.poster ?? null,
      tracks: (record.tracks || [])
        .filter(
          (track): track is NonNullable<ProjectVideoRecord['tracks']>[number] & {
            file: MediaDoc | number
            language: 'en' | 'fr'
          } => Boolean(track.file && (track.language === 'en' || track.language === 'fr')),
        )
        .map((track) => ({
          file: track.file,
          kind: track.kind || 'captions',
          language: track.language,
          label: clean(track.label) || (track.language === 'fr' ? 'Français' : 'English'),
          default: track.default === true,
          id: track.id ?? null,
        })),
      startAt: safeStartAt(record.startAt),
      aspectRatio: record.aspectRatio || '16:9',
      id: record.id ?? null,
    }))
  }

  return source?.video
    ? [
        {
          source: 'upload',
          asset: source.video,
          url: null,
          title: clean(source.title) || 'Project video',
          caption: null,
          poster: null,
          tracks: [],
          startAt: 0,
          aspectRatio: '16:9',
          id: 'legacy-video',
        },
      ]
    : []
}
