import type { Metadata } from 'next'

import type { Locale } from '@/i18n/config'
import { getPublicSiteURL } from '@/utilities/getPublicSiteURL'

import { OG_HEIGHT, OG_RENDER_VERSION, OG_WIDTH } from './constants'

type SocialMetadataInput = {
  locale: Locale
  path?: string[]
  title: string
  description: string
  revision?: string | null
}

function localizedPath(locale: Locale, path: string[]) {
  const tail = path.map(encodeURIComponent).join('/')
  return `/${locale}${tail ? `/${tail}` : ''}`
}

export function ogImageUrl(locale: Locale, path: string[] = [], revision?: string | null) {
  const tail = path.map(encodeURIComponent).join('/')
  const url = new URL(`/api/og/${locale}${tail ? `/${tail}` : ''}`, getPublicSiteURL())
  url.searchParams.set('v', `${OG_RENDER_VERSION}:${revision || 'current'}`)
  return url.toString()
}

export function socialMetadata({
  locale,
  path = [],
  title,
  description,
  revision,
}: SocialMetadataInput): Metadata {
  const base = getPublicSiteURL()
  const image = ogImageUrl(locale, path, revision)
  const canonical = new URL(localizedPath(locale, path), base).toString()
  const alt = `${title} — Saël Simard`

  return {
    description,
    alternates: {
      canonical,
      languages: {
        en: new URL(localizedPath('en', path), base).toString(),
        fr: new URL(localizedPath('fr', path), base).toString(),
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      siteName: 'Saël Simard',
      url: canonical,
      title,
      description,
      images: [{ url: image, width: OG_WIDTH, height: OG_HEIGHT, alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image, alt }],
    },
  }
}
