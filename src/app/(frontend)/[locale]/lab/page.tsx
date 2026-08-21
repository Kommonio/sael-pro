import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LabThread } from '@/components/PageThread'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogLab } from '@/lib/catalog'
import { getLabItems } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Lab',
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/lab`,
      languages: { en: `${getServerSideURL()}/en/lab`, fr: `${getServerSideURL()}/fr/lab` },
    },
  }
}

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const { docs } = await getLabItems(locale)
  const items = docs.length
    ? docs.map((item) => ({ slug: item.slug, year: item.year, title: item.title, lede: item.lede, url: item.url }))
    : catalogLab(locale)

  return (
    <>
      <h1 className="sr-only">{locale === 'fr' ? 'Laboratoire' : 'Lab'}</h1>
      <LabThread locale={locale} items={items} />
    </>
  )
}
