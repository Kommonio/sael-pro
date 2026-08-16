import config from '@payload-config'
import { getPayload } from 'payload'

import type { ProjectCardData } from '@/components/ProjectCard'
import type { Locale } from '@/i18n/config'
import type { MediaDoc } from '@/lib/media'
import type { Project } from '@/payload-types'

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
  const payload = await payloadClient()
  return payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: 'en',
    depth: 2,
    limit: 100,
    sort: '-year',
    draft: false,
    where: {
      ...(opts?.featured ? { featured: { equals: true } } : {}),
      ...(opts?.authorship ? { authorship: { equals: opts.authorship } } : {}),
    },
  })
}

export async function getProject(slug: string, locale: Locale) {
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
}

export async function getLabItems(locale: Locale) {
  const payload = await payloadClient()
  return payload.find({
    collection: 'lab-items',
    locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 50,
    sort: '-year',
  })
}
