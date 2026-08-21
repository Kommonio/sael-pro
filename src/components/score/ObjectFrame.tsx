import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'

import type { ProjectCardData } from '../ProjectCard'
import { RememberDots } from '../RememberDots'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function ObjectFrame({
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
  const climate = climateOf(project)

  return (
    <article data-attend={project.slug} data-score-frame="object" className={`min-h-[64svh] md:min-h-[80svh] ${className}`}>
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug} className="block h-full">
        <WorkLink
          href={`/${locale}/work/${project.slug}`}
          className={
            paired
              ? 'score-type flex min-h-[64svh] items-stretch gap-6 px-6 no-underline md:min-h-[80svh] md:px-8'
              : 'score-type site-shell flex min-h-[64svh] items-stretch gap-8 no-underline md:min-h-[80svh] md:gap-16'
          }
        >
          <p className="score-object-year type-meta text-ink/40">{project.year}</p>
          <div className="flex flex-1 flex-col justify-center py-14">
            <span className="score-object-mark" aria-hidden />
            <p className="mt-10 type-meta text-ink/45">{locale === 'fr' ? 'Objet' : 'Object'}</p>
            <h2 className={`mt-5 font-display leading-[0.8] ${paired ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-7xl md:text-[6.4rem]'}`}>
              {project.title}
            </h2>
            <p className="mt-10 max-w-lg type-lede text-ink/70">{project.lede}</p>
            <p className="mt-5 max-w-lg text-ink/55">{project.role}</p>
            <RememberDots />
          </div>
        </WorkLink>
      </RememberHold>
    </article>
  )
}
