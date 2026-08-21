import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkThread } from '@/components/WorkThread'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogProjectCards } from '@/lib/catalog'
import { getProjects, toProjectCard } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Œuvre' : 'Work',
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/work`,
      languages: {
        en: `${getServerSideURL()}/en/work`,
        fr: `${getServerSideURL()}/fr/work`,
      },
    },
  }
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const { docs } = await getProjects(locale)
  const projects = docs.length ? docs.map(toProjectCard) : catalogProjectCards(locale)

  return (
    <div className="pb-20 md:pb-24">
      <h1 className="sr-only">{locale === 'fr' ? 'Œuvre' : 'Work'}</h1>
      <WorkThread locale={locale} projects={projects} />
    </div>
  )
}
