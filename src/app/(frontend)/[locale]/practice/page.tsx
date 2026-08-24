import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContentEssay, EssayBody, EssaySection } from '@/components/ContentEssay'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogPractice, overlayPracticeCopy } from '@/lib/catalog'
import { SECTION } from '@/lib/covers'
import { socialMetadata } from '@/lib/og/metadata'
import { getGlobal } from '@/lib/payload'
import { lexicalText } from '@/lib/richText'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const title = locale === 'fr' ? 'Pratique' : 'Practice'
  const description =
    locale === 'fr'
      ? 'La méthode derrière un travail qui doit tenir techniquement, spatialement et émotionnellement.'
      : 'The method behind work that must hold technically, spatially and emotionally.'
  return {
    title,
    ...socialMetadata({ locale, path: ['practice'], title, description }),
  }
}

export default async function PracticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const practice = await getGlobal<{
    title?: string
    intro?: string
    sections?: { title?: string; body?: unknown }[]
  }>('practice', locale)
  const fallback = catalogPractice(locale)
  const cmsSections = (practice.sections || []).map((section) => ({
    title: section.title,
    body: lexicalText(section.body as never) || '',
  }))
  const chain = overlayPracticeCopy(fallback.chain, cmsSections)
  const sections = overlayPracticeCopy(fallback.sections, cmsSections)

  return (
    <ContentEssay
      still={SECTION.practice}
      meta={locale === 'fr' ? 'Pratique' : 'Practice'}
      title={practice.title || fallback.title}
      lede={practice.intro || fallback.intro}
    >
      <ol className="practice-chain">
        {chain.map((step, i) => (
          <li key={step.title}>
            <p className="type-meta text-ink/45">{String(i + 1).padStart(2, '0')}</p>
            <h3>{step.title}</h3>
            <EssayBody text={step.plain} />
          </li>
        ))}
      </ol>
      {sections.map((section) => (
        <EssaySection key={section.title} title={section.title}>
          <EssayBody text={section.plain} />
        </EssaySection>
      ))}
    </ContentEssay>
  )
}
