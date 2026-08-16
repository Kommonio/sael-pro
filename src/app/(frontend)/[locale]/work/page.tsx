import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkFilters } from '@/components/WorkFilters'
import { isLocale, type Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { getProjects } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

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
  const labels = t(locale)

  return (
    <div className="site-shell py-16 md:py-24">
      <p className="type-meta text-ink/50">{labels.work}</p>
      <h1 className="type-display mt-4 max-w-4xl">
        {locale === 'fr'
          ? 'Des objets, des salles, des plateformes, des systèmes. Une pratique.'
          : 'Objects, rooms, platforms, systems. One practice.'}
      </h1>
      <div className="mt-16">
        <WorkFilters locale={locale} projects={docs} />
      </div>
    </div>
  )
}
