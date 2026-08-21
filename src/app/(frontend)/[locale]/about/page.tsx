import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContentEssay, EssayBody, EssaySection } from '@/components/ContentEssay'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogAbout } from '@/lib/catalog'
import { PORTRAIT } from '@/lib/covers'
import { getGlobal } from '@/lib/payload'
import { lexicalText } from '@/lib/richText'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    currentRole?: string
    bio?: unknown
    phases?: { title?: string; body?: string }[]
    capabilities?: { domain?: string; note?: string }[]
    education?: { place?: string; detail?: string; years?: string }[]
  }>('about', locale)
  const fallback = catalogAbout(locale)
  const cmsPhases = (about.phases || []).filter((phase) => phase.title && phase.body)
  const phases = cmsPhases.length === fallback.phases.length ? cmsPhases : fallback.phases
  const domains = (about.capabilities || []).filter((cap) => cap.domain)
  const resolvedDomains = domains.length ? domains : fallback.capabilities
  const cmsEducation = (about.education || []).filter((item) => item.place && item.detail && item.years)
  const education = cmsEducation.length === fallback.education.length ? cmsEducation : fallback.education
  const bio = lexicalText(about.bio as never) || fallback.bio
  const fr = locale === 'fr'

  return (
    <ContentEssay
      still={PORTRAIT}
      meta={fr ? 'À propos' : 'About'}
      title={about.title || fallback.title}
      lede={about.currentRole || fallback.currentRole}
    >
      <EssayBody text={bio} />
      {phases.map((phase) => (
        <EssaySection key={phase.title} title={phase.title as string}>
          <EssayBody text={phase.body} />
        </EssaySection>
      ))}
      {resolvedDomains.length ? (
        <EssaySection title={fr ? 'Domaines' : 'Domains'}>
          <ul className="capability-list">
            {resolvedDomains.map((domain) => (
              <li key={domain.domain}>
                <p className="font-display text-xl">{domain.domain}</p>
                {domain.note ? <p className="mt-2 essay-copy">{domain.note}</p> : null}
              </li>
            ))}
          </ul>
        </EssaySection>
      ) : null}
      {education.length ? (
        <EssaySection title={fr ? 'Formation' : 'Education'}>
          <ul className="education-list">
            {education.map((item) => (
              <li key={`${item.place}-${item.years}`}>
                <p className="type-meta text-ink/45">{item.years}</p>
                <p className="mt-1 font-display text-xl">{item.place}</p>
                {item.detail ? <p className="mt-2 essay-copy">{item.detail}</p> : null}
              </li>
            ))}
          </ul>
        </EssaySection>
      ) : null}
    </ContentEssay>
  )
}
