import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'

import type { ProjectCardData } from '../ProjectCard'
import { NightWhenInView } from '../NightWhenInView'
import { RememberDots } from '../RememberDots'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function EventFrame({
  project,
  locale,
  compact = false,
  className = '',
}: {
  project: ProjectCardData
  locale: Locale
  compact?: boolean
  className?: string
}) {
  const climate = climateOf(project)

  return (
    <article
      data-attend={project.slug}
      data-score-frame="event"
      className={`bg-night text-paper ${compact ? 'min-h-[64svh]' : 'min-h-[85svh] md:min-h-[80svh]'} ${className}`}
    >
      <NightWhenInView slug={project.slug} />
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug} className="block h-full">
        <WorkLink
          href={`/${locale}/work/${project.slug}`}
          className={`score-type relative flex h-full flex-col justify-between px-6 py-14 no-underline md:px-12 ${compact ? 'min-h-[64svh]' : 'min-h-[85svh] md:min-h-[80svh]'}`}
        >
          <p className="type-meta text-ochre">
            {locale === 'fr' ? 'Événement · RV festival' : 'Event · Festival VR'} · {project.year}
          </p>
          <h2 className={`font-display leading-[0.8] break-words text-paper ${compact ? 'text-5xl sm:text-7xl' : 'text-5xl sm:text-7xl md:text-[7rem]'}`}>
            {project.title}
          </h2>
          <div className="max-w-xl">
            <p className="text-paper/75">{project.lede}</p>
            <p className="mt-5 type-meta text-paper/45">{project.role}</p>
          </div>
          <RememberDots />
        </WorkLink>
      </RememberHold>
    </article>
  )
}
