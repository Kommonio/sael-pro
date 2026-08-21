import type { Locale } from '@/i18n/config'
import { lexicalText } from '@/lib/richText'
import { parseExternalVideo, type VideoAspectRatio, type VideoSourceType } from '@/lib/videoMedia'

export const PUBLIC_PROJECT_LOCALES = ['en', 'fr'] as const satisfies readonly Locale[]

export const PUBLIC_PROJECT_TAGS = [
  'authored',
  'systems',
  'interactive',
  'immersive',
  'software',
  'experiments',
] as const

export type PublicProjectTag = (typeof PUBLIC_PROJECT_TAGS)[number]
export type PublicProjectAuthorship = 'authored' | 'collaborative' | 'contribution' | 'experiment'
export type PublicProjectTier = 'a' | 'b' | 'c'
export type PublicProjectVerification = 'verified' | 'needs-media' | 'needs-copy'
export type PublicProjectStatus = 'draft' | 'published'
export type PublicProjectHeroTreatment = 'media' | 'typographic'
export type PublicMediaPurpose = 'informative' | 'decorative'

/**
 * Transitional source shape for Payload records.
 *
 * `heroTreatment`, `purpose`, and `rightsConfirmed` intentionally describe the
 * next additive CMS migration without pretending that the fields exist today.
 * Until that migration is backfilled, the readiness gate reports precise
 * failures and the legacy route readers remain available.
 */
export type PublicProjectMediaSource = {
  id?: string | number | null
  url?: string | null
  alt?: string | null
  credit?: string | null
  creditUrl?: string | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  mimeType?: string | null
  kind?: 'auto' | 'image' | 'video' | 'diagram' | 'captions' | null
  purpose?: PublicMediaPurpose | null
  rightsConfirmed?: boolean | null
  sizes?: Record<string, { url?: string | null } | null | undefined> | null
}

export type PublicProjectSource = {
  id: string | number
  slug: string
  title?: string | null
  year?: string | null
  role?: string | null
  studio?: string | null
  client?: string | null
  location?: string | null
  authorship?: PublicProjectAuthorship | null
  tier?: PublicProjectTier | null
  featured?: boolean | null
  featuredOrder?: number | null
  verification?: PublicProjectVerification | null
  climateHint?: 'earth' | 'sap' | 'clay' | 'moss' | 'acid' | null
  tags?: readonly (string | null | undefined)[] | null
  lede?: string | null
  question?: string | null
  experience?: unknown
  system?: unknown
  whatChanged?: unknown
  technologies?: readonly (string | null | undefined)[] | null
  credits?: readonly { name?: string | null; role?: string | null }[] | null
  externalUrl?: string | null
  hero?: string | number | PublicProjectMediaSource | null
  gallery?: readonly { image?: string | number | PublicProjectMediaSource | null }[] | null
  video?: string | number | PublicProjectMediaSource | null
  videos?: readonly {
    source?: VideoSourceType | null
    asset?: string | number | PublicProjectMediaSource | null
    url?: string | null
    title?: string | null
    caption?: string | null
    poster?: string | number | PublicProjectMediaSource | null
    tracks?: readonly {
      file?: string | number | PublicProjectMediaSource | null
      kind?: 'captions' | 'subtitles' | null
      language?: 'en' | 'fr' | null
      label?: string | null
      default?: boolean | null
      id?: string | number | null
    }[] | null
    startAt?: number | null
    aspectRatio?: VideoAspectRatio | null
    id?: string | number | null
  }[] | null
  diagram?: string | number | PublicProjectMediaSource | null
  heroTreatment?: PublicProjectHeroTreatment | null
  _status?: PublicProjectStatus | null
}

export type LocalizedProjectSources = Partial<Record<Locale, PublicProjectSource | null>>

export type PublicProjectCredit = {
  name: string
  role: string
}

export type PublicProjectMedia = {
  id: string | number | null
  url: string | null
  alt: string
  credit: string | null
  creditUrl: string | null
  width: number | null
  height: number | null
  mimeType: string | null
  kind: PublicProjectMediaSource['kind']
  purpose: PublicMediaPurpose | null
  rightsConfirmed: boolean
  focalPoint: {
    x: number
    y: number
    css: string
  }
  sizes: PublicProjectMediaSource['sizes']
}

export type PublicProjectVideo = {
  source: VideoSourceType
  asset: PublicProjectMedia | null
  url: string | null
  title: string
  caption: string | null
  poster: PublicProjectMedia | null
  tracks: {
    file: PublicProjectMedia | null
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

export type PublicProjectReadinessCode =
  | 'locale-missing'
  | 'not-published'
  | 'not-verified'
  | 'required-field-missing'
  | 'credits-missing'
  | 'credit-incomplete'
  | 'hero-treatment-missing'
  | 'hero-treatment-mismatch'
  | 'hero-media-missing'
  | 'media-unresolved'
  | 'media-url-missing'
  | 'media-purpose-missing'
  | 'media-purpose-mismatch'
  | 'informative-alt-missing'
  | 'decorative-alt-not-empty'
  | 'media-rights-unconfirmed'
  | 'media-credit-missing'
  | 'video-source-invalid'
  | 'featured-order-missing'
  | 'experiment-taxonomy-mismatch'
  | 'experiment-case-study-incomplete'
  | 'internal-editorial-note'

export type PublicProjectReadinessIssue = {
  code: PublicProjectReadinessCode
  path: string
  message: string
  locale?: Locale
}

export type PublicProjectReadiness = {
  isPublic: boolean
  issues: PublicProjectReadinessIssue[]
  checkedLocales: readonly Locale[]
}

export type PublicProjectView = {
  id: string | number
  locale: Locale
  slug: string
  title: string
  year: string
  role: string
  studio: string | null
  client: string | null
  location: string | null
  authorship: PublicProjectAuthorship
  tier: PublicProjectTier
  tags: PublicProjectTag[]
  featured: boolean
  featuredOrder: number | null
  verification: PublicProjectVerification | null
  status: PublicProjectStatus | null
  climateHint: 'earth' | 'sap' | 'clay' | 'moss' | 'acid'
  lede: string
  question: string | null
  experience: string | null
  system: string | null
  whatChanged: string | null
  technologies: string[]
  credits: PublicProjectCredit[]
  externalUrl: string | null
  heroTreatment: PublicProjectHeroTreatment | null
  hero: PublicProjectMedia | null
  gallery: PublicProjectMedia[]
  video: PublicProjectMedia | null
  videos: PublicProjectVideo[]
  diagram: PublicProjectMedia | null
  readiness: PublicProjectReadiness
}

const INTERNAL_EDITORIAL_LANGUAGE = [
  /\bpending\b/i,
  /\bto be recovered\b/i,
  /\bshould be recovered\b/i,
  /\bremain(?:s|ing)? for confirmation\b/i,
  /\barchive recovery\b/i,
  /\bsecret secret\b/i,
  /\ben attente\b/i,
  /\bà récupérer\b/i,
  /\breste(?:nt)? à confirmer\b/i,
  /\brécupération des archives\b/i,
] as const

function clean(value?: string | null) {
  return value?.trim() || ''
}

function richText(value: unknown) {
  if (typeof value === 'string') return clean(value)
  return lexicalText(value as Parameters<typeof lexicalText>[0])
}

function clampPercent(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 50
  return Math.min(100, Math.max(0, value))
}

function isMedia(value: PublicProjectSource['hero']): value is PublicProjectMediaSource {
  return Boolean(value && typeof value === 'object')
}

function normalizeMedia(value: PublicProjectSource['hero']): PublicProjectMedia | null {
  if (!isMedia(value)) return null
  const x = clampPercent(value.focalX)
  const y = clampPercent(value.focalY)
  return {
    id: value.id ?? null,
    url: clean(value.url) || null,
    alt: clean(value.alt),
    credit: clean(value.credit) || null,
    creditUrl: clean(value.creditUrl) || null,
    width: value.width ?? null,
    height: value.height ?? null,
    mimeType: clean(value.mimeType) || null,
    kind: value.kind ?? null,
    purpose: value.purpose ?? null,
    rightsConfirmed: value.rightsConfirmed === true,
    focalPoint: { x, y, css: `${x}% ${y}%` },
    sizes: value.sizes ?? null,
  }
}

export function normalizePublicProjectTags(tags?: PublicProjectSource['tags']): PublicProjectTag[] {
  const present = new Set(
    (tags || [])
      .map((tag) => clean(tag).toLowerCase())
      .filter((tag): tag is PublicProjectTag =>
        (PUBLIC_PROJECT_TAGS as readonly string[]).includes(tag),
      ),
  )
  return PUBLIC_PROJECT_TAGS.filter((tag) => present.has(tag))
}

function projectCredits(source?: PublicProjectSource | null): PublicProjectCredit[] {
  return (source?.credits || [])
    .map((credit) => ({ name: clean(credit.name), role: clean(credit.role) }))
    .filter((credit) => Boolean(credit.name || credit.role))
}

function issueKey(issue: PublicProjectReadinessIssue) {
  return `${issue.code}|${issue.locale || ''}|${issue.path}`
}

function stableIssues(issues: PublicProjectReadinessIssue[]) {
  const unique = new Map(issues.map((issue) => [issueKey(issue), issue]))
  return [...unique.values()].sort((a, b) => issueKey(a).localeCompare(issueKey(b)))
}

function mediaSlots(source?: PublicProjectSource | null) {
  if (!source) return new Map<string, PublicProjectSource['hero']>()
  const slots = new Map<string, PublicProjectSource['hero']>()
  if (source.hero != null) slots.set('hero', source.hero)
  source.gallery?.forEach((item, index) => {
    if (item.image != null) slots.set(`gallery.${index}.image`, item.image)
  })
  if (source.video != null) slots.set('video', source.video)
  source.videos?.forEach((video, index) => {
    if (video.source === 'upload' && video.asset != null) {
      slots.set(`videos.${index}.asset`, video.asset)
    }
    if (video.poster != null) slots.set(`videos.${index}.poster`, video.poster)
  })
  if (source.diagram != null) slots.set('diagram', source.diagram)
  return slots
}

function containsInternalLanguage(source: PublicProjectSource) {
  const fields = [
    ['title', source.title],
    ['role', source.role],
    ['client', source.client],
    ['location', source.location],
    ['lede', source.lede],
    ['question', source.question],
    ['experience', richText(source.experience)],
    ['system', richText(source.system)],
    ['whatChanged', richText(source.whatChanged)],
  ] as const
  return fields.filter(([, value]) => INTERNAL_EDITORIAL_LANGUAGE.some((pattern) => pattern.test(clean(value))))
}

export function derivePublicProjectReadiness(sources: LocalizedProjectSources): PublicProjectReadiness {
  const issues: PublicProjectReadinessIssue[] = []

  for (const locale of PUBLIC_PROJECT_LOCALES) {
    const source = sources[locale]
    if (!source) {
      issues.push({
        code: 'locale-missing',
        locale,
        path: locale,
        message: `Add the ${locale.toUpperCase()} project record without locale fallback.`,
      })
      continue
    }

    if (source._status !== 'published') {
      issues.push({
        code: 'not-published',
        locale,
        path: '_status',
        message: `Publish the ${locale.toUpperCase()} project version.`,
      })
    }
    if (source.verification !== 'verified') {
      issues.push({
        code: 'not-verified',
        locale,
        path: 'verification',
        message: `Set verification to “Verified” after factual and content review (${locale.toUpperCase()}).`,
      })
    }

    const required = [
      ['title', source.title],
      ['year', source.year],
      ['role', source.role],
      ['lede', source.lede],
    ] as const
    for (const [path, value] of required) {
      if (!clean(value)) {
        issues.push({
          code: 'required-field-missing',
          locale,
          path,
          message: `Complete ${path} in ${locale.toUpperCase()}.`,
        })
      }
    }

    const credits = projectCredits(source)
    if (!credits.length) {
      issues.push({
        code: 'credits-missing',
        locale,
        path: 'credits',
        message: `Add approved credits in ${locale.toUpperCase()}.`,
      })
    }
    credits.forEach((credit, index) => {
      if (!credit.name || !credit.role) {
        issues.push({
          code: 'credit-incomplete',
          locale,
          path: `credits.${index}`,
          message: `Complete both credit name and localized role in ${locale.toUpperCase()}.`,
        })
      }
    })

    for (const [path] of containsInternalLanguage(source)) {
      issues.push({
        code: 'internal-editorial-note',
        locale,
        path,
        message: `Remove archive-recovery, pending-confirmation, or other internal editorial language from ${path} (${locale.toUpperCase()}).`,
      })
    }

    source.videos?.forEach((video, index) => {
      const path = `videos.${index}`
      if (!clean(video.title)) {
        issues.push({
          code: 'required-field-missing',
          locale,
          path: `${path}.title`,
          message: `Add an accessible video title in ${locale.toUpperCase()}.`,
        })
      }
      if (video.source === 'upload' && video.asset == null) {
        issues.push({
          code: 'required-field-missing',
          locale,
          path: `${path}.asset`,
          message: `Choose a Blob-hosted video asset in ${locale.toUpperCase()}.`,
        })
      }
      if (
        (video.source === 'youtube' || video.source === 'vimeo') &&
        !parseExternalVideo(video.source, video.url)
      ) {
        issues.push({
          code: 'video-source-invalid',
          locale,
          path: `${path}.url`,
          message: `Add a valid ${video.source === 'youtube' ? 'YouTube' : 'Vimeo'} URL or video ID in ${locale.toUpperCase()}.`,
        })
      }
    })
  }

  const canonical = sources.en || sources.fr
  const treatments = PUBLIC_PROJECT_LOCALES.map((locale) => sources[locale]?.heroTreatment).filter(
    (value): value is PublicProjectHeroTreatment => value === 'media' || value === 'typographic',
  )
  const treatment = treatments[0] || null
  if (!treatment) {
    issues.push({
      code: 'hero-treatment-missing',
      path: 'heroTreatment',
      message: 'Choose an intentional hero treatment: “Media” or “Typographic”.',
    })
  } else if (
    treatments.some((value) => value !== treatment) ||
    PUBLIC_PROJECT_LOCALES.some((locale) => sources[locale] && !sources[locale]?.heroTreatment)
  ) {
    issues.push({
      code: 'hero-treatment-mismatch',
      path: 'heroTreatment',
      message: 'Use the same non-localized hero treatment in every locale.',
    })
  }

  if (treatment === 'media' && !isMedia(canonical?.hero)) {
    issues.push({
      code: 'hero-media-missing',
      path: 'hero',
      message: 'The “Media” hero treatment requires a populated hero asset.',
    })
  }

  if (canonical?.featured && typeof canonical.featuredOrder !== 'number') {
    issues.push({
      code: 'featured-order-missing',
      path: 'featuredOrder',
      message: 'Assign a featured order to every featured project.',
    })
  }

  if (canonical) {
    if (!clean(canonical.slug)) {
      issues.push({
        code: 'required-field-missing',
        path: 'slug',
        message: 'Add a stable public slug.',
      })
    }
    if (!canonical.authorship) {
      issues.push({
        code: 'required-field-missing',
        path: 'authorship',
        message: 'Choose the exact authorship relationship.',
      })
    }
    if (!canonical.tier) {
      issues.push({
        code: 'required-field-missing',
        path: 'tier',
        message: 'Choose a Work tier.',
      })
    }
    const tags = normalizePublicProjectTags(canonical.tags)
    const isExperiment = canonical.authorship === 'experiment' || canonical.tier === 'c'
    if (isExperiment && (canonical.authorship !== 'experiment' || canonical.tier !== 'c' || !tags.includes('experiments'))) {
      issues.push({
        code: 'experiment-taxonomy-mismatch',
        path: 'authorship,tier,tags',
        message: 'A case-study-grade Work experiment must use authorship “Experiment”, tier C, and the “Experiments” tag. Small utilities belong in Lab Items.',
      })
    }
    if (isExperiment) {
      for (const locale of PUBLIC_PROJECT_LOCALES) {
        const source = sources[locale]
        if (!source || !clean(source.question) || !richText(source.experience) || !richText(source.system)) {
          issues.push({
            code: 'experiment-case-study-incomplete',
            locale,
            path: 'question,experience,system',
            message: `Complete case-study question, experience, and system copy in ${locale.toUpperCase()}, or move the item to Lab.`,
          })
        }
      }
    }
  }

  const slotsByLocale = Object.fromEntries(
    PUBLIC_PROJECT_LOCALES.map((locale) => [locale, mediaSlots(sources[locale])]),
  ) as Record<Locale, Map<string, PublicProjectSource['hero']>>
  const slotNames = new Set(PUBLIC_PROJECT_LOCALES.flatMap((locale) => [...slotsByLocale[locale].keys()]))

  for (const path of slotNames) {
    const localized = PUBLIC_PROJECT_LOCALES.map((locale) => ({ locale, value: slotsByLocale[locale].get(path) }))
    const populated = localized.find(({ value }) => isMedia(value))?.value
    if (!isMedia(populated)) {
      issues.push({
        code: 'media-unresolved',
        path,
        message: `Populate ${path} at query depth 2 so its accessibility and rights metadata can be validated.`,
      })
      continue
    }

    if (!populated.purpose) {
      issues.push({
        code: 'media-purpose-missing',
        path: `${path}.purpose`,
        message: `Declare ${path} as informative or decorative.`,
      })
    }
    if (!clean(populated.url)) {
      issues.push({
        code: 'media-url-missing',
        path: `${path}.url`,
        message: `Upload or connect a public asset URL for ${path}.`,
      })
    }
    if (populated.rightsConfirmed !== true) {
      issues.push({
        code: 'media-rights-unconfirmed',
        path: `${path}.rightsConfirmed`,
        message: `Confirm display rights for ${path}.`,
      })
    }
    if (!clean(populated.credit)) {
      issues.push({
        code: 'media-credit-missing',
        path: `${path}.credit`,
        message: `Add a creator, studio, or rights-holder credit for ${path}.`,
      })
    }

    const isVideoAsset =
      populated.kind === 'video' || clean(populated.mimeType).toLowerCase().startsWith('video/')

    for (const { locale, value } of localized) {
      if (!isMedia(value)) {
        issues.push({
          code: 'media-unresolved',
          locale,
          path,
          message: `Populate ${path} in ${locale.toUpperCase()} without locale fallback.`,
        })
        continue
      }
      if (value.purpose && populated.purpose && value.purpose !== populated.purpose) {
        issues.push({
          code: 'media-purpose-mismatch',
          locale,
          path: `${path}.purpose`,
          message: `Use the same non-localized media purpose for ${path} in every locale.`,
        })
      }
      if (populated.purpose === 'informative' && !isVideoAsset && !clean(value.alt)) {
        issues.push({
          code: 'informative-alt-missing',
          locale,
          path: `${path}.alt`,
          message: `Write localized alt text for informative ${path} in ${locale.toUpperCase()}.`,
        })
      }
      if (populated.purpose === 'decorative' && clean(value.alt)) {
        issues.push({
          code: 'decorative-alt-not-empty',
          locale,
          path: `${path}.alt`,
          message: `Clear alt text for decorative ${path} in ${locale.toUpperCase()} so it remains silent.`,
        })
      }
    }
  }

  const normalized = stableIssues(issues)
  return {
    isPublic: normalized.length === 0,
    issues: normalized,
    checkedLocales: PUBLIC_PROJECT_LOCALES,
  }
}

export function toPublicProjectView(
  sources: LocalizedProjectSources,
  locale: Locale,
): PublicProjectView | null {
  const source = sources[locale] || sources.en || sources.fr
  if (!source) return null
  const gallery = (source.gallery || [])
    .map((item) => normalizeMedia(item.image))
    .filter((media): media is PublicProjectMedia => Boolean(media))
  const videos = (source.videos || []).map((video) => ({
    source: video.source || 'upload',
    asset: normalizeMedia(video.asset),
    url: clean(video.url) || null,
    title: clean(video.title),
    caption: clean(video.caption) || null,
    poster: normalizeMedia(video.poster),
    tracks: (video.tracks || []).map((track) => ({
      file: normalizeMedia(track.file),
      kind: track.kind || 'captions',
      language: track.language || 'en',
      label: clean(track.label) || (track.language === 'fr' ? 'Français' : 'English'),
      default: track.default === true,
      id: track.id ?? null,
    })),
    startAt:
      typeof video.startAt === 'number' && Number.isFinite(video.startAt)
        ? Math.max(0, Math.floor(video.startAt))
        : 0,
    aspectRatio: video.aspectRatio || '16:9',
    id: video.id ?? null,
  }))

  return {
    id: source.id,
    locale,
    slug: clean(source.slug),
    title: clean(source.title),
    year: clean(source.year),
    role: clean(source.role),
    studio: clean(source.studio) || null,
    client: clean(source.client) || null,
    location: clean(source.location) || null,
    authorship: source.authorship || 'contribution',
    tier: source.tier || 'b',
    tags: normalizePublicProjectTags(source.tags),
    featured: source.featured === true,
    featuredOrder: typeof source.featuredOrder === 'number' ? source.featuredOrder : null,
    verification: source.verification || null,
    status: source._status || null,
    climateHint: source.climateHint || 'earth',
    lede: clean(source.lede),
    question: clean(source.question) || null,
    experience: richText(source.experience) || null,
    system: richText(source.system) || null,
    whatChanged: richText(source.whatChanged) || null,
    technologies: (source.technologies || []).map((item) => clean(item)).filter(Boolean),
    credits: projectCredits(source).filter((credit) => Boolean(credit.name && credit.role)),
    externalUrl: clean(source.externalUrl) || null,
    heroTreatment: source.heroTreatment || null,
    hero: normalizeMedia(source.hero),
    gallery,
    video: normalizeMedia(source.video),
    videos,
    diagram: normalizeMedia(source.diagram),
    readiness: derivePublicProjectReadiness(sources),
  }
}

export function publicReadyProjects(views: readonly (PublicProjectView | null)[]) {
  return views.filter((view): view is PublicProjectView => Boolean(view?.readiness.isPublic))
}
