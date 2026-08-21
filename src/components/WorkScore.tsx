'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { Flip, gsap, registerMotion, ScrollTrigger } from '@/lib/motion'

import type { ProjectCardData } from './ProjectCard'
import { BleedFrame } from './score/BleedFrame'
import { EntryFrame } from './score/EntryFrame'
import { EventFrame } from './score/EventFrame'
import { FieldFrame } from './score/FieldFrame'
import { LineFrame } from './score/LineFrame'
import { ObjectFrame } from './score/ObjectFrame'
import { PrintFrame } from './score/PrintFrame'
import { matchesFilter } from './score/shared'

const FILTERS = ['all', 'authored', 'systems', 'interactive', 'immersive', 'software', 'experiments'] as const

function pick(projects: ProjectCardData[], slug: string) {
  return projects.find((project) => project.slug === slug) || null
}

export function WorkScore({ locale, projects }: { locale: Locale; projects: ProjectCardData[] }) {
  const labels = t(locale)
  const root = useRef<HTMLDivElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const visible = projects.filter((project) => matchesFilter(project, filter))
  const azul = pick(visible, 'azul-vivo')
  const trees = pick(visible, 'man-who-planted-trees')
  const onmove = pick(visible, 'onmove')
  const viventi = pick(visible, 'viventi-mori')
  const omega = pick(visible, 'omega-protocol')
  const echoes = pick(visible, 'echoes')
  const versus = pick(visible, 'versus')
  const lines = visible.filter((project) =>
    ['villa-hublot', 'sensory-odyssey', 'le-repaire'].includes(project.slug),
  )

  useEffect(() => {
    registerMotion()
    const frames = root.current?.querySelectorAll('[data-score-frame]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-open')
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -12% 0px' },
    )
    frames?.forEach((frame) => io.observe(frame))

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-score-frame="bleed"] .score-mask, [data-score-frame="field"] .score-mask, .score-print-plate', {
        start: 'top 78%',
        once: true,
        onEnter: (els) => {
          gsap.to(els, {
            clipPath: 'inset(0)',
            scale: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 1.15,
            ease: 'power3.out',
          })
        },
      })
      ScrollTrigger.batch('[data-score-frame="object"] .score-type, [data-score-frame="event"] .score-type, [data-score-frame="entry"] .score-type', {
        start: 'top 82%',
        once: true,
        onEnter: (els) => {
          gsap.fromTo(els, { y: 20, opacity: 0.35 }, { y: 0, opacity: 1, duration: 1, stagger: 0.06, ease: 'power3.out' })
        },
      })
    }, root)
    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [filter])

  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, { duration: 0.55, ease: 'power2.inOut', absoluteOnLeave: true, fade: true })
    flipState.current = null
  }, [filter])

  const applyFilter = (next: (typeof FILTERS)[number]) => {
    if (next === filter) return
    flipState.current = Flip.getState(root.current?.querySelectorAll('[data-score-frame], li') || [])
    setFilter(next)
  }

  return (
    <div ref={root}>
      <div className="site-shell pt-[calc(3.75rem+env(safe-area-inset-top))]">
        <div className="filter-row -mx-1 flex gap-1 overflow-x-auto pb-8 pt-6">
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyFilter(key)}
              className={`min-h-11 shrink-0 snap-start px-3 type-meta ${filter === key ? 'text-ink' : 'text-ink/40'}`}
            >
              {labels.filters[key]}
            </button>
          ))}
        </div>
      </div>

      {azul ? <BleedFrame project={azul} locale={locale} /> : null}

      {trees || onmove ? (
        <div className="md:grid md:grid-cols-12">
          {trees ? (
            <div className="min-w-0 md:col-span-7">
              <PrintFrame project={trees} locale={locale} paired />
            </div>
          ) : null}
          {onmove ? (
            <div className="min-w-0 overflow-hidden md:col-span-5">
              <FieldFrame project={onmove} locale={locale} paired />
            </div>
          ) : null}
        </div>
      ) : null}

      {viventi || omega ? (
        <div className="md:grid md:grid-cols-12">
          {viventi ? (
            <div className="min-w-0 md:col-span-4">
              <ObjectFrame project={viventi} locale={locale} paired />
            </div>
          ) : null}
          {omega ? (
            <div className="min-w-0 overflow-hidden md:col-span-8">
              <EventFrame project={omega} locale={locale} />
            </div>
          ) : null}
        </div>
      ) : null}

      {echoes ? (
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-8">
            <EntryFrame project={echoes} locale={locale} />
          </div>
        </div>
      ) : null}

      {versus ? (
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-9 md:col-start-4">
            <EventFrame project={versus} locale={locale} compact />
          </div>
        </div>
      ) : null}

      {lines.length ? (
        <section className="site-shell py-20">
          <p className="type-meta text-ink/45">{labels.contributions}</p>
          <ul className="mt-10">
            {lines.map((project) => (
              <LineFrame key={project.slug} project={project} locale={locale} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
