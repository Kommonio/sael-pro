'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

import { MediaFigure } from './MediaFigure'
import type { ProjectCardData } from './ProjectCard'
import type { WorkFilter } from './WorkThread'
import { useMobileSurface } from './useMobileSurface'

export function MobileWorkIndex({
  locale,
  projects,
  filters,
  filter,
  onFilter,
}: {
  locale: Locale
  projects: ProjectCardData[]
  filters: readonly WorkFilter[]
  filter: WorkFilter
  onFilter: (filter: WorkFilter) => void
}) {
  const labels = t(locale)
  const fr = locale === 'fr'
  const root = useRef<HTMLElement>(null)
  useMobileSurface(root)

  return (
    <section ref={root} className="mobile-work-index" aria-labelledby="mobile-work-title">
      <header className="mobile-work-opening" data-mobile-surface="paper">
        <svg viewBox="0 0 390 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M312 0 C319 120 78 118 82 270 C86 405 312 374 287 520" />
          <circle cx="82" cy="270" r="4" />
        </svg>
        <div>
          <p className="type-meta">{fr ? 'Œuvre · sélection complète' : 'Work · complete selection'}</p>
          <h2 id="mobile-work-title" className="font-display">{labels.work}</h2>
          <p>
            {fr
              ? 'Mondes d’auteur, systèmes, logiciels et contributions créditées — chaque rôle reste visible.'
              : 'Authored worlds, systems, software, and credited contributions — every role stays visible.'}
          </p>
        </div>
        <p className="mobile-work-count type-meta">
          {String(projects.length).padStart(2, '0')} {fr ? 'projets' : 'projects'}
        </p>
      </header>

      <div className="mobile-work-filter-shell">
        <div className="mobile-work-filters" aria-label={fr ? 'Filtrer les projets' : 'Filter projects'}>
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilter(key)}
              className="type-meta"
              aria-pressed={filter === key}
            >
              {labels.filters[key]}
            </button>
          ))}
        </div>
      </div>

      {projects.length ? (
        <div className="mobile-work-field" data-mobile-surface="night">
          <svg className="mobile-work-thread" viewBox="0 0 390 1600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M304 0 C318 236 61 250 74 510 C86 742 330 712 306 984 C287 1202 74 1192 91 1600" />
          </svg>
          {projects.map((project, index) => (
            <RememberHold key={project.slug} slug={project.slug} className="mobile-work-card-hold">
              <Link
                href={`/${locale}/work/${project.slug}`}
                className="mobile-work-card no-underline"
                data-mobile-work-shape={index % 4}
              >
                <MediaFigure
                  media={typeof project.hero === 'object' ? project.hero : null}
                  slug={project.slug}
                  title={project.title}
                  climate={project.climateHint || 'earth'}
                  className="mobile-work-card-media"
                  sizes="92vw"
                  priority={index === 0}
                  overlay={false}
                />
                <span className="mobile-work-card-shade" aria-hidden="true" />
                <span className="mobile-work-card-index type-meta">{String(index + 1).padStart(2, '0')}</span>
                <span className="mobile-work-card-copy">
                  <span className="type-meta">
                    {[project.year, project.authorship === 'authored' ? (fr ? 'Auteur' : 'Authored') : project.studio || project.role]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  <strong className="font-display">{project.title}</strong>
                  <span>{project.lede}</span>
                  <span className="mobile-work-card-enter type-meta">
                    {fr ? 'Voir le projet' : 'View project'} <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </Link>
            </RememberHold>
          ))}
        </div>
      ) : (
        <div className="mobile-work-empty" role="status">
          <p className="font-display">
            {fr ? 'Aucun projet ne correspond encore à ce filtre.' : 'No projects match this filter yet.'}
          </p>
          <button type="button" className="type-meta" onClick={() => onFilter('all')}>
            {fr ? 'Tout afficher' : 'Show all'}
          </button>
        </div>
      )}
    </section>
  )
}
