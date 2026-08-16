'use client'

import { useMemo, useState } from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

import { ProjectCard, type ProjectCardData } from './ProjectCard'

const FILTERS = ['all', 'authored', 'systems', 'interactive', 'immersive', 'software', 'experiments'] as const

export function WorkFilters({
  locale,
  projects,
}: {
  locale: Locale
  projects: Array<ProjectCardData & { tags?: string[] | null }>
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const labels = t(locale)
  const visible = useMemo(() => {
    if (filter === 'all') return projects
    return projects.filter((project) => project.tags?.includes(filter) || project.authorship === filter)
  }, [filter, projects])

  return (
    <div>
      <div className="mb-12 flex flex-wrap gap-x-5 gap-y-2">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`type-meta ${filter === key ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}
          >
            {labels.filters[key]}
          </button>
        ))}
      </div>
      <div className="grid gap-16">
        {visible.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            size={i % 4 === 0 ? 'xl' : i % 4 === 3 ? 'compact' : 'regular'}
          />
        ))}
      </div>
    </div>
  )
}
