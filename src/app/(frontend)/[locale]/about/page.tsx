import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaFigure } from '@/components/MediaFigure'
import { isLocale, type Locale } from '@/i18n/config'
import type { MediaDoc } from '@/lib/media'
import { getGlobal } from '@/lib/payload'
import { RichText } from '@/lib/richText'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'À propos' : 'About',
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/about`,
      languages: { en: `${getServerSideURL()}/en/about`, fr: `${getServerSideURL()}/fr/about` },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const about = await getGlobal<{
    title?: string
    bio?: never
    currentRole?: string
    portrait?: MediaDoc | number | null
    phases?: { title?: string; body?: string }[]
    capabilities?: { domain?: string; note?: string }[]
    education?: { place?: string; detail?: string; years?: string }[]
  }>('about', locale)

  return (
    <div className="site-shell py-16 md:py-24">
      <p className="type-meta text-ink/50">{locale === 'fr' ? 'À propos' : 'About'}</p>
      <h1 className="type-display mt-4 max-w-4xl">{about.title}</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="relative min-h-[52vw] md:col-span-5 md:min-h-[64vh]">
          <MediaFigure
            media={typeof about.portrait === 'object' ? about.portrait : null}
            title="Saël Simard"
            climate="moss"
            className="absolute inset-0"
          />
        </div>
        <div className="md:col-span-7">
          <p className="type-lede text-ink/75">{about.currentRole}</p>
          <div className="mt-8">
            <RichText data={about.bio} />
          </div>
        </div>
      </div>
      <div className="mt-24 grid gap-12 md:grid-cols-2">
        {(about.phases || []).map((phase) => (
          <section key={phase.title} className="border-t border-ink/10 pt-6">
            <h2 className="type-title">{phase.title}</h2>
            <p className="mt-4 text-ink/70">{phase.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-24">
        <p className="type-meta text-ink/50">{locale === 'fr' ? 'Domaines' : 'Domains'}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {(about.capabilities || []).map((cap) => (
            <div key={cap.domain}>
              <h3 className="font-display text-2xl">{cap.domain}</h3>
              <p className="mt-3 text-sm text-ink/65">{cap.note}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-24 border-t border-ink/10 pt-10">
        {(about.education || []).map((item) => (
          <p key={item.place} className="mb-3 text-sm text-ink/70">
            <span className="text-ink">{item.place}</span> — {item.detail} {item.years ? `(${item.years})` : ''}
          </p>
        ))}
      </div>
    </div>
  )
}
