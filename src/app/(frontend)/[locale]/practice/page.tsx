import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale, type Locale } from '@/i18n/config'
import { getGlobal } from '@/lib/payload'
import { RichText } from '@/lib/richText'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Pratique' : 'Practice',
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/practice`,
      languages: {
        en: `${getServerSideURL()}/en/practice`,
        fr: `${getServerSideURL()}/fr/practice`,
      },
    },
  }
}

export default async function PracticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const practice = await getGlobal<{
    title?: string
    intro?: string
    sections?: { title?: string; body?: never }[]
  }>('practice', locale)

  return (
    <div className="site-shell py-16 md:py-24">
      <p className="type-meta text-ink/50">{locale === 'fr' ? 'Pratique' : 'Practice'}</p>
      <h1 className="type-display mt-4 max-w-4xl">{practice.title}</h1>
      <p className="mt-8 max-w-2xl type-lede text-ink/75">{practice.intro}</p>
      <div className="mt-20 grid gap-16">
        {(practice.sections || []).map((section, i) => (
          <section key={section.title} className="grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-12">
            <p className="font-mono text-xs text-ink/40 md:col-span-2">0{i + 1}</p>
            <div className="md:col-span-10">
              <h2 className="type-title">{section.title}</h2>
              <div className="mt-5">
                <RichText data={section.body} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
