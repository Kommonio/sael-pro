import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'

import type { ProjectCardData } from '../ProjectCard'
import { RememberDots } from '../RememberDots'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function EntryFrame({
  project,
  locale,
  className = '',
}: {
  project: ProjectCardData
  locale: Locale
  className?: string
}) {
  const climate = climateOf(project)

  return (
    <article data-attend={project.slug} data-score-frame="entry" className={`py-16 ${className}`}>
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug}>
        <WorkLink href={`/${locale}/work/${project.slug}`} className="score-type site-shell relative block no-underline">
          <p className="type-meta text-ink/45">{project.year}</p>
          <h2 className="type-display mt-4">{project.title}</h2>
          <p className="mt-5 max-w-xl text-ink/65">{project.lede}</p>
          <p className="mt-4 text-ink/55">{project.role}</p>
          <RememberDots />
        </WorkLink>
      </RememberHold>
    </article>
  )
}
