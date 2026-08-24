import type { MetadataRoute } from 'next'

import { getPublicSiteURL } from '@/utilities/getPublicSiteURL'

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteURL()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
