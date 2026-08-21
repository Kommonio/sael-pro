import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import { coverFor } from '@/lib/covers'

import type { ProjectCardData } from '../ProjectCard'
import { NightWhenInView } from '../NightWhenInView'
import { RememberDots } from '../RememberDots'
import { Still } from '../Still'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function BleedFrame({
  project,
  locale,
  className = '',
}: {
  project: ProjectCardData
  locale: Locale
  className?: string
}) {
  const cover = coverFor(project.slug)
  const climate = climateOf(project)

  return (
    <article data-attend={project.slug} data-score-frame="bleed" className={`relative min-h-[100svh] bg-night md:min-h-[88svh] ${className}`}>
      <NightWhenInView slug={project.slug} />
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug} className="relative block min-h-[100svh] md:min-h-[88svh]">
        <WorkLink href={`/${locale}/work/${project.slug}`} className="group relative block min-h-[100svh] no-underline md:min-h-[88svh]">
          {cover ? (
            <Still
              src={cover.src}
              alt={cover.alt}
              credit={cover.credit}
              position="center top"
              transitionName={`still-${project.slug}`}
              className="score-mask absolute inset-0 min-h-[100svh] w-full md:min-h-[88svh]"
            />
          ) : null}
          <RememberDots />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 via-night/25 to-transparent px-6 pb-10 pt-28 md:px-12">
            <p className="type-meta text-paper/65">
              {project.year} · {locale === 'fr' ? 'Auteur' : 'Authored'}
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.86] text-paper sm:text-7xl">{project.title}</h2>
            <p className="mt-5 max-w-xl text-paper/80">{project.lede}</p>
          </div>
        </WorkLink>
      </RememberHold>
    </article>
  )
}
