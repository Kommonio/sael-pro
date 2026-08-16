import config from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'

export async function payloadClient() {
  return getPayload({ config })
}

export async function getGlobal<T = Record<string, unknown>>(slug: string, locale: Locale) {
  const payload = await payloadClient()
  return payload.findGlobal({
    slug: slug as 'site',
    locale,
    fallbackLocale: 'en',
    depth: 2,
  }) as Promise<T>
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
