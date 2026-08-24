import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkThread } from '@/components/WorkThread'
import { isLocale, type Locale } from '@/i18n/config'
import { catalogProjectCards } from '@/lib/catalog'
import { socialMetadata } from '@/lib/og/metadata'
import { getProjects, toProjectCard } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const title = locale === 'fr' ? 'Œuvre' : 'Work'
  const description =
    locale === 'fr'
      ? 'Mondes d’auteur, systèmes spatiaux, médias immersifs et l’infrastructure qui les fait tenir.'
      : 'Authored worlds, spatial systems, immersive media and the infrastructure that holds them together.'
  return {
    title,
    ...socialMetadata({ locale, path: ['work'], title, description }),
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
