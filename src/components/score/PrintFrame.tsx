import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import { coverFor } from '@/lib/covers'

import type { ProjectCardData } from '../ProjectCard'
import { RememberDots } from '../RememberDots'
import { Still } from '../Still'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function PrintFrame({
  project,
  locale,
  paired = false,
  className = '',
}: {
  project: ProjectCardData
  locale: Locale
  paired?: boolean
  className?: string
}) {
  const cover = coverFor(project.slug)
  const climate = climateOf(project)

  return (
    <article data-attend={project.slug} data-score-frame="print" className={`min-h-[72svh] py-10 md:min-h-[68svh] ${className}`}>
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug}>
        <WorkLink
          href={`/${locale}/work/${project.slug}`}
          className={
            paired
              ? 'grid items-end gap-8 px-6 no-underline md:px-8'
              : 'site-shell grid items-end gap-8 no-underline md:grid-cols-12 md:gap-12'
          }
        >
          <div className={paired ? '' : 'md:col-span-5'}>
            <p className="type-meta text-ink/45">{locale === 'fr' ? 'Contribution' : 'Contribution'}</p>
            <p className="mt-5 type-meta text-ink/70">{project.studio}</p>
            <h2 className="type-display mt-4">{project.title}</h2>
            <p className="mt-5 max-w-md text-ink/70">{project.role}</p>
            <p className="mt-4 type-meta text-ink/40">{project.year}</p>
          </div>
          <div className={paired ? 'score-print-plate relative' : 'score-print-plate relative md:col-span-7'}>
            {cover ? (
              <Still
                src={cover.src}
                alt={cover.alt}
                credit={cover.credit}
                transitionName={`still-${project.slug}`}
                className="aspect-[4/5] w-full md:aspect-[5/4]"
              />
            ) : null}
            <RememberDots />
          </div>
        </WorkLink>
      </RememberHold>
    </article>
  )
}
