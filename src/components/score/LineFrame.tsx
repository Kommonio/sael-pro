import type { Locale } from '@/i18n/config'

import type { ProjectCardData } from '../ProjectCard'
import { WorkLink } from '../WorkLink'

export function LineFrame({ project, locale }: { project: ProjectCardData; locale: Locale }) {
  return (
    <li className="border-t border-ink/10 py-7">
      <WorkLink
        href={`/${locale}/work/${project.slug}`}
        className="grid gap-2 no-underline md:grid-cols-12 md:items-end"
      >
        <p className="type-meta text-ink/45 md:col-span-3">
          {project.studio} · {project.year}
        </p>
        <p className="font-display text-3xl leading-[0.92] md:col-span-5">{project.title}</p>
        <p className="text-ink/60 md:col-span-4 md:text-right">{project.role}</p>
      </WorkLink>
    </li>
  )
}
