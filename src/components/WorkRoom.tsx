'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

import { Attend } from '@/condition/Attend'
import type { Locale } from '@/i18n/config'
import { coverFor } from '@/lib/covers'

import type { ProjectCardData } from './ProjectCard'
import { Still } from './Still'

const ROOM: Record<number, string> = {
  0: 'z-20 col-span-12 row-span-6 sm:col-span-8 sm:row-span-8 md:col-span-7 md:row-span-8',
  1: 'z-30 col-span-8 col-start-5 row-span-4 row-start-5 sm:col-span-6 sm:col-start-7 sm:row-span-5 sm:row-start-1',
  2: 'z-20 col-span-7 row-span-4 row-start-9 sm:col-span-5 sm:row-span-5 sm:row-start-6',
  3: 'z-10 col-span-6 col-start-7 row-span-4 row-start-9 sm:col-span-5 sm:col-start-8 sm:row-span-4 sm:row-start-7',
  4: 'hidden sm:block z-10 sm:col-span-4 sm:col-start-5 sm:row-span-3 sm:row-start-9',
}

const SHIFT = [
  'w-[94%]',
  'ml-auto w-[88%]',
  'w-[90%] ml-[5%]',
  'ml-auto w-[84%]',
  'w-[92%] ml-[3%]',
  'ml-auto w-[90%]',
  'w-[86%] ml-[8%]',
  'ml-auto w-[88%]',
  'w-[93%]',
  'ml-auto w-[85%]',
]

const ASPECT = [
  'aspect-[4/5]',
  'aspect-[16/10]',
  'aspect-[5/4]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-[16/9]',
  'aspect-[4/3]',
  'aspect-[5/6]',
]

function Frame({
  project,
  locale,
  className,
}: {
  project: ProjectCardData
  locale: Locale
  className: string
}) {
  const cover = coverFor(project.slug)

  return (
    <article data-attend={project.slug} className={`group relative min-h-0 overflow-hidden bg-[#0e0c09] ${className}`}>
      <Attend
        slug={project.slug}
        title={project.title}
        authorship={project.authorship}
        climateHint={(project.climateHint as 'earth') || 'earth'}
      />
      <Link href={`/${locale}/work/${project.slug}`} className="absolute inset-0 no-underline">
        {cover ? (
          <Still src={cover.src} alt={cover.alt} className="absolute inset-0 h-full w-full" />
        ) : (
          <div
            className="cover-field absolute inset-0"
            style={
              {
                ['--cover' as string]: '#6b4a1a',
                ['--cover-wash' as string]: '#1a1610',
              } as CSSProperties
            }
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/75 via-night/20 to-transparent px-4 pb-4 pt-16">
          <p className="type-meta text-paper/70">{project.year}</p>
          <p className="mt-1 font-display text-2xl leading-[0.92] text-paper sm:text-3xl">{project.title}</p>
        </div>
      </Link>
    </article>
  )
}

export function WorkRoom({
  locale,
  projects,
  compact = false,
}: {
  locale: Locale
  projects: ProjectCardData[]
  compact?: boolean
}) {
  if (compact) {
    const frames = projects.slice(0, 5)
    return (
      <div className="relative grid h-full min-h-[22rem] grid-cols-12 grid-rows-12 gap-2 md:gap-3">
        {frames.map((project, i) => (
          <Frame key={project.slug} project={project} locale={locale} className={ROOM[i] || ROOM[4]} />
        ))}
      </div>
    )
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 sm:gap-5">
      {projects.map((project, i) => (
        <div key={project.slug} className={`mb-4 break-inside-avoid sm:mb-5 ${SHIFT[i % SHIFT.length]} sm:ml-0 sm:w-full`}>
          <div className={`relative ${ASPECT[i % ASPECT.length]}`}>
            <Frame project={project} locale={locale} className="absolute inset-0" />
          </div>
        </div>
      ))}
    </div>
  )
}
