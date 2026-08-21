import Link from 'next/link'

import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import type { MediaDoc } from '@/lib/media'

import { MediaFigure } from './MediaFigure'

export type ProjectCardData = {
  slug: string
  title: string
  year?: string | null
  role: string
  studio?: string | null
  authorship: 'authored' | 'collaborative' | 'contribution' | 'experiment'
  lede: string
  tags?: string[] | null
  climateHint?: string | null
  hero?: MediaDoc | number | null
}

export function ProjectCard({
  project,
  locale,
  size = 'regular',
}: {
  project: ProjectCardData
  locale: Locale
  size?: 'xl' | 'regular' | 'compact'
}) {
  const height =
    size === 'xl' ? 'min-h-[72vw] md:min-h-[78vh]' : size === 'compact' ? 'min-h-[46vw] md:min-h-[38vh]' : 'min-h-[58vw] md:min-h-[56vh]'

  return (
    <RememberHold slug={project.slug}>
      <article data-attend={project.slug} className="group">
        <Link href={`/${locale}/work/${project.slug}`} className="block no-underline">
          <div className={`relative ${height}`}>
            <MediaFigure
              media={typeof project.hero === 'object' ? project.hero : null}
              slug={project.slug}
              title={project.title}
              climate={project.climateHint || 'earth'}
              className="absolute inset-0"
              sizes={size === 'xl' ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
            />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="type-meta text-ink/50">
                {project.studio ? `${project.studio} · ` : ''}
                {project.year}
              </p>
              <h2 className="type-title mt-1">{project.title}</h2>
              {project.lede ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65">{project.lede}</p> : null}
            </div>
            <p className="md:col-span-5 md:text-right text-sm leading-snug text-ink/70">{project.role}</p>
          </div>
        </Link>
      </article>
    </RememberHold>
  )
}
