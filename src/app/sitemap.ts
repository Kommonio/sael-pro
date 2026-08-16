import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { getProjects } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const paths = ['', '/work', '/practice', '/lab', '/about', '/contact']
  let slugs: string[] = []
  try {
    const { docs } = await getProjects('en')
    slugs = docs.map((doc) => doc.slug).filter(Boolean)
  } catch {
    slugs = []
  }

  const entries: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        alternates: {
          languages: {
            en: `${base}/en${path}`,
            fr: `${base}/fr${path}`,
          },
        },
      })
    }
    for (const slug of slugs) {
      entries.push({
        url: `${base}/${locale}/work/${slug}`,
        alternates: {
          languages: {
            en: `${base}/en/work/${slug}`,
            fr: `${base}/fr/work/${slug}`,
          },
        },
      })
    }
  }
  return entries
}
