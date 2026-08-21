import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { ProjectCardData } from '@/components/ProjectCard'
import type { Locale } from '@/i18n/config'
import { sortByRecency } from '@/lib/catalog'
import type { MediaDoc } from '@/lib/media'
import {
  PUBLIC_PROJECT_LOCALES,
  publicReadyProjects,
  toPublicProjectView,
  type LocalizedProjectSources,
  type PublicProjectAuthorship,
  type PublicProjectReadinessIssue,
  type PublicProjectView,
} from '@/lib/publicProjects'
import type { LabItem, Project } from '@/payload-types'

export type ProjectCardRecord = ProjectCardData & {
  tags?: string[] | null
  featuredOrder?: number | null
  featured?: boolean | null
}

export function toProjectCard(doc: Project): ProjectCardRecord {
  return {
    slug: doc.slug,
    title: doc.title,
    year: doc.year,
    role: doc.role,
    studio: doc.studio,
    authorship: doc.authorship,
    lede: doc.lede,
    climateHint: doc.climateHint,
    hero: typeof doc.hero === 'object' && doc.hero ? (doc.hero as MediaDoc) : null,
    tags: doc.tags,
    featuredOrder: doc.featuredOrder,
    featured: doc.featured,
  }
}

export async function payloadClient() {
  return getPayload({ config })
}

export async function getGlobal<T extends object = Record<string, unknown>>(
  slug: string,
  locale: Locale,
): Promise<T> {
  try {
    const payload = await payloadClient()
    return (await payload.findGlobal({
      slug: slug as 'site',
      locale,
      fallbackLocale: 'en',
      depth: 2,
    })) as T
  } catch {
    return {} as T
  }
}

export async function getProjects(locale: Locale, opts?: { featured?: boolean; authorship?: string }) {
  try {
    const payload = await payloadClient()
    const result = await payload.find({
      collection: 'projects',
      locale,
      fallbackLocale: 'en',
      depth: 2,
      limit: 100,
      sort: '-year',
      where: {
        ...(opts?.featured ? { featured: { equals: true } } : {}),
        ...(opts?.authorship ? { authorship: { equals: opts.authorship } } : {}),
      },
    })
    return { ...result, docs: sortByRecency(result.docs) }
  } catch {
    return { docs: [] as Project[], totalDocs: 0 }
  }
}

export async function getProject(slug: string, locale: Locale) {
  try {
    const payload = await payloadClient()
    const result = await payload.find({
      collection: 'projects',
      locale,
      fallbackLocale: 'en',
      depth: 2,
      limit: 1,
      where: { slug: { equals: slug } },
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getLabItems(locale: Locale) {
  try {
    const payload = await payloadClient()
    return await payload.find({
      collection: 'lab-items',
      locale,
      fallbackLocale: 'en',
      depth: 1,
      limit: 50,
      sort: '-year',
    })
  } catch {
    return { docs: [] as LabItem[], totalDocs: 0 }
  }
}

type PublicProjectQuery = {
  featured?: boolean
  authorship?: PublicProjectAuthorship
}

export type PublicProjectsResult = {
  docs: PublicProjectView[]
  totalDocs: number
  excludedCount: number
}

export type ProjectReadinessSummary = {
  id: string | number
  slug: string
  title: string
  isPublic: boolean
  issues: PublicProjectReadinessIssue[]
}

async function findLocalizedProjectSources(where: Where, draft: boolean) {
  const payload = await payloadClient()
  const localized = await Promise.all(
    PUBLIC_PROJECT_LOCALES.map(async (locale) => ({
      locale,
      result: await payload.find({
        collection: 'projects',
        locale,
        fallbackLocale: false,
        depth: 2,
        limit: 100,
        sort: '-year',
        draft,
        where,
      }),
    })),
  )
  const bySlug = new Map<string, LocalizedProjectSources>()
  for (const { locale, result } of localized) {
    for (const doc of result.docs) {
      const sources = bySlug.get(doc.slug) || {}
      sources[locale] = doc
      bySlug.set(doc.slug, sources)
    }
  }
  return [...bySlug.values()]
}

/**
 * Strict public reader for the additive CMS contract in `publicProjects.ts`.
 * It queries every required locale without fallback, derives readiness on the
 * server, and never returns an ineligible record to a route.
 *
 * Existing routes intentionally keep using `getProjects` until the additive
 * hero/media contract is migrated and backfilled; switching early would hide
 * every current `needs-media` seed record.
 */
export async function getPublicProjects(
  locale: Locale,
  opts?: PublicProjectQuery,
): Promise<PublicProjectsResult> {
  try {
    const where: Where = {
      ...(typeof opts?.featured === 'boolean' ? { featured: { equals: opts.featured } } : {}),
      ...(opts?.authorship ? { authorship: { equals: opts.authorship } } : {}),
    }
    const sources = await findLocalizedProjectSources(where, false)
    const all = sources.map((source) => toPublicProjectView(source, locale))
    const docs = sortByRecency(publicReadyProjects(all))
    return { docs, totalDocs: docs.length, excludedCount: all.length - docs.length }
  } catch {
    return { docs: [], totalDocs: 0, excludedCount: 0 }
  }
}

export async function getPublicProject(slug: string, locale: Locale): Promise<PublicProjectView | null> {
  try {
    const sources = await findLocalizedProjectSources({ slug: { equals: slug } }, false)
    const view = sources[0] ? toPublicProjectView(sources[0], locale) : null
    return view?.readiness.isPublic ? view : null
  } catch {
    return null
  }
}

/** Server-only editorial report. Do not serialize this from a public route. */
export async function getProjectReadinessReport(): Promise<ProjectReadinessSummary[]> {
  try {
    const sources = await findLocalizedProjectSources({}, true)
    return sources
      .map((source) => toPublicProjectView(source, 'en'))
      .filter((view): view is PublicProjectView => Boolean(view))
      .map((view) => ({
        id: view.id,
        slug: view.slug,
        title: view.title,
        isPublic: view.readiness.isPublic,
        issues: view.readiness.issues,
      }))
      .sort((a, b) => a.slug.localeCompare(b.slug))
  } catch {
    return []
  }
}
