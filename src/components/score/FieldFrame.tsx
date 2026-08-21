import { Attend } from '@/condition/Attend'
import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import { coverFor } from '@/lib/covers'

import type { ProjectCardData } from '../ProjectCard'
import { RememberDots } from '../RememberDots'
import { Still } from '../Still'
import { WorkLink } from '../WorkLink'
import { climateOf } from './shared'

export function FieldFrame({
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
    <article data-attend={project.slug} data-score-frame="field" className={`min-h-[72svh] min-w-0 overflow-hidden md:min-h-[68svh] ${className}`}>
      <Attend slug={project.slug} title={project.title} authorship={project.authorship} climateHint={climate} />
      <RememberHold slug={project.slug} className="block h-full">
        <WorkLink
          href={`/${locale}/work/${project.slug}`}
          className={
            paired
              ? 'grid min-h-[72svh] no-underline md:min-h-[68svh]'
              : 'grid min-h-[72svh] no-underline md:min-h-[68svh] md:grid-cols-12'
          }
        >
          <div className={paired ? 'relative' : 'relative md:col-span-7'}>
            {cover ? (
              <Still
                src={cover.src}
                alt={cover.alt}
                credit={cover.credit}
                transitionName={`still-${project.slug}`}
                className={
                  paired
                    ? 'score-mask min-h-[48svh] w-full max-w-full md:min-h-[52svh]'
                    : 'score-mask min-h-[48svh] w-full max-w-full md:absolute md:inset-0 md:min-h-0'
                }
              />
            ) : null}
            <RememberDots />
          </div>
          <div className={paired ? 'flex flex-col justify-end px-6 py-10' : 'flex flex-col justify-end px-6 py-10 md:col-span-5 md:px-10'}>
            <p className="type-meta text-ink/45">{locale === 'fr' ? 'Logiciel / plateforme' : 'Software / platform'}</p>
            <h2 className="type-display mt-5">{project.title}</h2>
            <p className="mt-6 max-w-md text-ink/70">{project.lede}</p>
            <p className="mt-6 type-meta text-ink/40">
              {project.year} · {project.role}
            </p>
          </div>
        </WorkLink>
      </RememberHold>
    </article>
  )
}
