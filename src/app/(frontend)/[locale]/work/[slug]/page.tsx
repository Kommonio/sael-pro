import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Attend } from '@/condition/Attend'
import { CaseClimate } from '@/components/CaseClimate'
import { CaseStudy, type CaseStudyNeighbor } from '@/components/CaseStudy'
import { isLocale, type Locale } from '@/i18n/config'
import type { ClimateHint } from '@/condition/types'
import { catalogCaseStudy, mergeCaseStudy } from '@/lib/caseStudies'
import { catalogProjectCards, FEATURED_SLUGS } from '@/lib/catalog'
import { coverFor, GALLERY } from '@/lib/covers'
import type { MediaDoc } from '@/lib/media'
import { getProject, getProjects, toProjectCard } from '@/lib/payload'
import { normalizeProjectVideos } from '@/lib/videoMedia'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  try {
    const { docs } = await getProjects('en')
    return ['en', 'fr'].flatMap((locale) => docs.map((doc) => ({ locale, slug: doc.slug })))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = (await getProject(slug, locale)) || catalogCaseStudy(slug, locale as Locale)
  if (!project) return {}
  return {
    title: project.title,
    description: project.lede,
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/work/${slug}`,
      languages: {
        en: `${getServerSideURL()}/en/work/${slug}`,
        fr: `${getServerSideURL()}/fr/work/${slug}`,
      },
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const [cms, projectResult] = await Promise.all([getProject(slug, locale), getProjects(locale)])
  const project = mergeCaseStudy(slug, locale, cms)
  if (!project) notFound()
  const hero = cms && typeof cms.hero === 'object' ? (cms.hero as MediaDoc) : null
  const galleryMedia =
    cms?.gallery
      ?.map((item) => (typeof item.image === 'object' ? (item.image as MediaDoc) : null))
      .filter((item): item is MediaDoc => Boolean(item)) || []
  const diagram = cms && typeof cms.diagram === 'object' ? (cms.diagram as MediaDoc) : null
  const videos = normalizeProjectVideos(cms)
  const climate = (project.climateHint || 'earth') as ClimateHint
  const cover = coverFor(project.slug)
  const stills = GALLERY[project.slug] || (cover ? [cover] : [])
  const cmsCards = projectResult.docs.map(toProjectCard)
  const seen = new Set(cmsCards.map((card) => card.slug))
  const projectCards = [...cmsCards, ...catalogProjectCards(locale).filter((card) => !seen.has(card.slug))]
  const cardsBySlug = new Map(projectCards.map((card) => [card.slug, card]))
  const traversalCards = FEATURED_SLUGS.map((featuredSlug) => cardsBySlug.get(featuredSlug)).filter(
    (card): card is NonNullable<typeof card> => Boolean(card),
  )
  const currentIndex = traversalCards.findIndex((card) => card.slug === project.slug)
  const nextCard =
    traversalCards.length > 1 && currentIndex >= 0
      ? traversalCards[(currentIndex + 1) % traversalCards.length]
      : traversalCards[0] || projectCards.find((card) => card.slug !== project.slug) || null
  const nextProject: CaseStudyNeighbor | null = nextCard
    ? {
        slug: nextCard.slug,
        title: nextCard.title,
        year: nextCard.year,
        role: nextCard.role,
        lede: nextCard.lede,
      }
    : null

  return (
    <article data-attend={project.slug}>
      <CaseClimate hint={climate} night={Boolean(cover || hero)} />
      <Attend
        slug={project.slug}
        title={project.title}
        authorship={project.authorship}
        climateHint={climate}
      />
      <CaseStudy
        locale={locale}
        project={project}
        stills={stills}
        hero={hero}
        galleryMedia={galleryMedia}
        diagram={diagram}
        videos={videos}
        climate={climate}
        nextProject={nextProject}
      />
    </article>
  )
}
