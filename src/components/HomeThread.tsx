'use client'

import { useCallback } from 'react'

import type { Locale } from '@/i18n/config'
import { homeGraph } from '@/thread/recipes'

import { MobileHomeJourney } from './MobileHomeJourney'
import { ThreadCanvas } from './ThreadCanvas'
import type { ProjectCardData } from './ProjectCard'

export function HomeThread({
  locale,
  thesis,
  projects,
  lab,
}: {
  locale: Locale
  thesis: string
  projects: ProjectCardData[]
  lab: { slug: string; title: string; year?: string | null; url?: string | null; lede?: string | null }[]
}) {
  const build = useCallback(() => homeGraph(locale, thesis, projects, lab), [locale, thesis, projects, lab])
  return (
    <>
      <div className="home-thread-canvas">
        <ThreadCanvas build={build} intro="sael" context="home" />
      </div>
      <MobileHomeJourney locale={locale} thesis={thesis} projects={projects} lab={lab} />
    </>
  )
}
