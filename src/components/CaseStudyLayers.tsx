'use client'

import { useEffect, useState } from 'react'

import type { Cover } from '@/lib/covers'

import { Still } from './Still'

export type CaseStudyRailItem = {
  id: string
  label: string
  index: string
}

type SystemMapLabels = {
  systemMap: string
  sourceContext: string
  exactRole: string
  resultingWork: string
  knownModules: string
}

function SystemNode({
  className,
  eyebrow,
  value,
}: {
  className: string
  eyebrow: string
  value: string
}) {
  return (
    <div className={`case-system-node ${className}`}>
      <span>{eyebrow}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function CaseStudyRail({ label, items }: { label: string; items: CaseStudyRailItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '')
  const itemIds = items.map((item) => item.id).join('|')

  useEffect(() => {
    const sections = itemIds
      .split('|')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return

    let frame = 0
    const update = () => {
      frame = 0
      const marker = Math.min(window.innerHeight * 0.28, 240)
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top > marker) break
        current = section
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]
      }
      setActiveId(current.id)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [itemIds])

  return (
    <div className="case-rail-shell">
      <nav className="case-rail" aria-label={label}>
        <ol>
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active ? 'location' : undefined}>
                  <span className="case-rail-dot" aria-hidden="true" />
                  <span className="case-rail-index">{item.index}</span>
                  <span className="case-rail-label">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export function CaseSystemMap({
  title,
  context,
  role,
  technologies,
  still,
  labels,
}: {
  title: string
  context: string
  role: string
  technologies: string[]
  still?: Cover
  labels: SystemMapLabels
}) {
  const description = `${labels.systemMap}: ${context}; ${role}; ${title}${
    technologies.length ? `; ${technologies.join(', ')}` : ''
  }.`

  return (
    <div className="case-system-map" role="group" aria-label={description}>
      <svg className="case-system-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M90 275 C220 275 210 155 355 155" />
        <path d="M90 275 C220 275 220 405 355 405" />
        <path d="M515 155 C630 155 610 275 750 275" />
        <path d="M515 405 C630 405 610 275 750 275" />
        <circle cx="90" cy="275" r="6" />
        <circle cx="355" cy="155" r="6" />
        <circle cx="355" cy="405" r="6" />
        <circle cx="750" cy="275" r="6" />
      </svg>

      <SystemNode className="case-system-node--source" eyebrow={labels.sourceContext} value={context} />
      <SystemNode className="case-system-node--role" eyebrow={labels.exactRole} value={role} />
      <SystemNode className="case-system-node--work" eyebrow={labels.resultingWork} value={title} />

      <div className="case-system-modules">
        <span>{labels.knownModules}</span>
        {technologies.length ? (
          <ul>
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        ) : (
          <span className="case-system-modules-empty">—</span>
        )}
      </div>

      {still ? (
        <figure className="case-system-evidence">
          <Still
            src={still.src}
            alt={still.alt}
            position="center"
            sizes="(min-width: 1024px) 22rem, 46vw"
            className="case-system-evidence-image"
          />
          {still.credit ? <figcaption>{still.credit}</figcaption> : null}
        </figure>
      ) : null}
    </div>
  )
}
