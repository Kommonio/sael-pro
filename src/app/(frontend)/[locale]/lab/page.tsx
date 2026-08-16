import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale, type Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { getLabItems } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

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
  const labels = t(locale)

  return (
    <div className="site-shell py-16 md:py-24">
      <p className="type-meta text-ink/50">{labels.lab}</p>
      <h1 className="type-display mt-4 max-w-3xl">
        {locale === 'fr'
          ? 'Petites choses expédiées parce que la question était là.'
          : 'Small things shipped because the question was there.'}
      </h1>
      <div className="mt-16 grid gap-12 md:grid-cols-2">
        {docs.map((item) => (
          <article key={item.slug} className="border-t border-ink/15 pt-6">
            <p className="type-meta text-ink/45">{item.year}</p>
            <h2 className="type-title mt-2">{item.title}</h2>
            <p className="mt-4 text-ink/70">{item.lede}</p>
            {item.url ? (
              <a href={item.url} className="mt-5 inline-block type-meta">
                {labels.visit}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
