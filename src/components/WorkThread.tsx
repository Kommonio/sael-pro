'use client'

import { useCallback, useMemo, useState } from 'react'

import { matchesFilter } from '@/components/score/shared'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { workGraph } from '@/thread/recipes'

import type { ProjectCardData } from './ProjectCard'
import { ThreadCanvas } from './ThreadCanvas'

const FILTERS = ['all', 'authored', 'systems', 'interactive', 'immersive', 'software', 'experiments'] as const

export function WorkThread({ locale, projects }: { locale: Locale; projects: ProjectCardData[] }) {
  const labels = t(locale)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const availableFilters = useMemo(
    () =>
      FILTERS.filter(
        (key) =>
          key !== 'experiments' ||
          projects.some(
            (project) => project.authorship === 'experiment' && project.tags?.includes('experiments'),
          ),
      ),
    [projects],
  )
  const visibleCount = useMemo(
    () => projects.filter((project) => matchesFilter(project, filter)).length,
    [filter, projects],
  )
  const build = useCallback(() => workGraph(locale, projects, filter), [locale, projects, filter])

  return (
    <ThreadCanvas
      build={build}
      filters={
        <div className="thread-filters">
          <div className="filter-row site-shell flex flex-nowrap items-center gap-x-1 overflow-x-auto py-2 md:flex-wrap md:overflow-visible md:py-4">
            {availableFilters.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`min-h-11 shrink-0 snap-start px-3 type-meta ${filter === key ? 'text-ink' : 'text-muted'}`}
                aria-pressed={filter === key}
              >
                {labels.filters[key]}
              </button>
            ))}
          </div>
        </div>
      }
      empty={
        visibleCount === 0 ? (
          <div className="site-shell flex min-h-[40svh] flex-col items-start justify-center gap-5" role="status">
            <p className="type-lede max-w-xl">
              {locale === 'fr'
                ? 'Aucun projet ne correspond encore à ce filtre.'
                : 'No projects match this filter yet.'}
            </p>
            <button type="button" className="min-h-11 type-meta underline" onClick={() => setFilter('all')}>
              {locale === 'fr' ? 'Tout afficher' : 'Show all'}
            </button>
          </div>
        ) : null
      }
    />
  )
}
