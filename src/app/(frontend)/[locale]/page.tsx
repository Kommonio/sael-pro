import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomeThread } from '@/components/HomeThread'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogLab, catalogProjectCards } from '@/lib/catalog'
import { socialMetadata } from '@/lib/og/metadata'
import { getGlobal, getLabItems, getProjects, toProjectCard } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const site = await getGlobal<{ seoTitle?: string; seoDescription?: string; thesis?: string; updatedAt?: string }>('site', raw)
  const title = site.seoTitle || 'Saël Simard'
  const description =
    site.seoDescription ||
    site.thesis ||
    (raw === 'fr'
      ? 'Images, logiciels, systèmes et espaces — conçus comme une seule rencontre.'
      : 'Images, software, systems and space — designed as one encounter.')
  return {
    title: { absolute: title },
    ...socialMetadata({ locale: raw, title, description, revision: site.updatedAt }),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [home, projects, labDocs] = await Promise.all([
    getGlobal<{ heroLine?: string }>('home', locale),
    getProjects(locale),
    getLabItems(locale),
  ])

  const cmsCards = projects.docs.map(toProjectCard)
  const allWork = cmsCards.length ? cmsCards : catalogProjectCards(locale)
  const lab =
    labDocs.docs.length > 0
      ? labDocs.docs.map((item) => ({
          slug: item.slug,
          year: item.year,
          url: item.url,
          title: item.title,
          lede: item.lede,
        }))
      : catalogLab(locale)

  const thesis =
    home.heroLine ||
    (locale === 'fr'
      ? 'Je conçois les conditions d’une expérience — images, logiciels, systèmes et espaces, comme une seule rencontre.'
      : 'I design the conditions for an experience — images, software, systems and space, as one encounter.')

  return (
    <>
      <h1 className="sr-only">Saël Simard</h1>
      <HomeThread
        locale={locale}
        thesis={thesis}
        projects={allWork}
        lab={lab}
      />
    </>
  )
}
