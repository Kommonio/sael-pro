'use client'

import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { coverFor } from '@/lib/covers'

import type { ProjectCardData } from './ProjectCard'
import { Still } from './Still'

export function FeaturedHang({
  locale,
  projects,
}: {
  locale: Locale
  projects: ProjectCardData[]
}) {
  const preferred = ['man-who-planted-trees', 'azul-vivo', 'onmove']
  const withStill = projects.filter((project) => coverFor(project.slug))
  const frames = preferred
    .map((slug) => withStill.find((project) => project.slug === slug))
    .filter((project): project is ProjectCardData => Boolean(project))
    .concat(withStill.filter((project) => !preferred.includes(project.slug)))
    .slice(0, 3)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto md:gap-3 md:overflow-visible">
        {frames.map((project) => {
          const cover = coverFor(project.slug)
          if (!cover) return null
          return (
            <Link
              key={project.slug}
              href={`/${locale}/work/${project.slug}`}
              className="relative h-full min-h-[70svh] w-[86vw] shrink-0 snap-center overflow-hidden no-underline md:min-h-0 md:w-auto md:flex-1"
            >
              <Still
                src={cover.src}
                alt={cover.alt}
                className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out hover:scale-[1.035]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 via-night/25 to-transparent px-5 pb-6 pt-24">
                <p className="type-meta text-paper/70">{project.year}</p>
                <p className="mt-2 font-display text-3xl leading-[0.9] text-paper md:text-4xl">{project.title}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="flex shrink-0 items-center justify-between pt-4">
        <p className="type-meta text-ink/45">
          {locale === 'fr' ? 'Image · système · lieu' : 'Image · system · place'}
        </p>
        <Link href={`/${locale}/work`} className="type-meta">
          {locale === 'fr' ? 'Toute l’œuvre' : 'All work'}
        </Link>
      </div>
    </div>
  )
}
