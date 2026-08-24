'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import { RememberHold } from '@/condition/RememberHold'
import type { Locale } from '@/i18n/config'
import { coverFor, PORTRAIT, SECTION } from '@/lib/covers'
import { mediaUrl } from '@/lib/media'

import { MediaFigure } from './MediaFigure'
import { MobileLabOrbit } from './MobileLabOrbit'
import type { ProjectCardData } from './ProjectCard'
import { Still } from './Still'

type LabCard = {
  slug: string
  title: string
  year?: string | null
  url?: string | null
  lede?: string | null
}

const FEATURED_ORDER = ['azul-vivo', 'onmove', 'man-who-planted-trees']

function hasProjectImage(project: ProjectCardData) {
  const hero = typeof project.hero === 'object' ? project.hero : null
  return Boolean(mediaUrl(hero, 'xlarge') || mediaUrl(hero) || coverFor(project.slug))
}

function selectProjects(projects: ProjectCardData[]) {
  const preferred = FEATURED_ORDER.map((slug) => projects.find((project) => project.slug === slug)).filter(
    (project): project is ProjectCardData => Boolean(project && hasProjectImage(project)),
  )
  const remaining = projects.filter(
    (project) => hasProjectImage(project) && !preferred.some((item) => item.slug === project.slug),
  )
  return [...preferred, ...remaining].slice(0, 3)
}

function authorshipLabel(project: ProjectCardData, locale: Locale) {
  const labels =
    locale === 'fr'
      ? {
          authored: 'Monde d’auteur',
          collaborative: 'Œuvre collaborative',
          contribution: 'Architecture technique',
          experiment: 'Expérience',
        }
      : {
          authored: 'Authored world',
          collaborative: 'Collaborative work',
          contribution: 'Technical architecture',
          experiment: 'Experiment',
        }
  return labels[project.authorship]
}

function projectAccent(project: ProjectCardData) {
  if (project.climateHint === 'sap') return 'var(--sap)'
  if (project.climateHint === 'moss') return 'var(--moss)'
  if (project.climateHint === 'clay') return 'var(--clay)'
  if (project.climateHint === 'acid') return 'var(--acid)'
  return 'var(--ochre)'
}

export function MobileHomeJourney({
  locale,
  thesis,
  projects,
  lab,
}: {
  locale: Locale
  thesis: string
  projects: ProjectCardData[]
  lab: LabCard[]
}) {
  const root = useRef<HTMLDivElement>(null)
  const featured = useMemo(() => selectProjects(projects), [projects])
  const [active, setActive] = useState(0)
  const chapterCount = featured.length + 3
  const progress = chapterCount > 1 ? active / (chapterCount - 1) : 0
  const fr = locale === 'fr'

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767.98px)')
    let observer: IntersectionObserver | null = null

    const observe = () => {
      observer?.disconnect()
      observer = null
      if (!media.matches || !root.current) return

      const chapters = Array.from(root.current.querySelectorAll<HTMLElement>('[data-mobile-home-chapter]'))
      observer = new IntersectionObserver(
        (entries) => {
          const candidate = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          if (!candidate) return
          const element = candidate.target as HTMLElement
          const index = Number(element.dataset.mobileHomeChapter || 0)
          setActive(index)
          document.documentElement.dataset.mobileHomeChapter = String(index)
          document.documentElement.dataset.mobileSurface = element.dataset.mobileHomeSurface || 'paper'
        },
        { rootMargin: '-24% 0px -48% 0px', threshold: [0, 0.15, 0.4, 0.7, 1] },
      )
      chapters.forEach((chapter) => observer?.observe(chapter))
    }

    observe()
    media.addEventListener('change', observe)
    return () => {
      observer?.disconnect()
      media.removeEventListener('change', observe)
      delete document.documentElement.dataset.mobileHomeChapter
      delete document.documentElement.dataset.mobileSurface
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--mobile-home-progress', String(progress))
    return () => {
      document.documentElement.style.removeProperty('--mobile-home-progress')
    }
  }, [progress])

  const text = fr
    ? {
        role: 'Architecte de systèmes · Technologue créatif · Médias immersifs',
        proof: 'L’œuvre commence ici',
        selected: 'Œuvres choisies',
        enter: 'Entrer dans l’étude',
        allWork: 'Voir toute l’œuvre',
        beyond: 'Sous la surface',
        beyondCopy: 'La même pensée traverse la méthode, les outils et les expériences en cours.',
        practice: 'Pratique',
        practiceCopy: 'Les principes qui tiennent ensemble images, logiciels, systèmes et espaces.',
        closing: 'L’expérience est le résultat. Le système est ce qui la rend inévitable.',
        contact: 'Commencer une conversation',
        index: 'Progression dans la page',
      }
    : {
        role: 'System architect · Creative technologist · Immersive media',
        proof: 'The work begins here',
        selected: 'Selected work',
        enter: 'Enter the case study',
        allWork: 'View all work',
        beyond: 'Below the surface',
        beyondCopy: 'The same thinking moves through the method, the tools, and the experiments still in progress.',
        practice: 'Practice',
        practiceCopy: 'The principles that hold images, software, systems, and space together.',
        closing: 'The experience is the outcome. The system is what makes it feel inevitable.',
        contact: 'Start a conversation',
        index: 'Progress through the page',
      }

  return (
    <div
      ref={root}
      className="mobile-home-journey"
      style={{ '--mobile-home-progress': progress } as CSSProperties}
      data-mobile-home-active={active}
    >
      <div className="mobile-home-progress" aria-label={text.index} role="img">
        <span>{String(active + 1).padStart(2, '0')}</span>
        <svg viewBox="0 0 18 156" aria-hidden="true">
          <path className="mobile-home-progress-track" d="M9 2 C2 34 16 58 9 82 C2 108 15 128 9 154" pathLength="1" />
          <path className="mobile-home-progress-value" d="M9 2 C2 34 16 58 9 82 C2 108 15 128 9 154" pathLength="1" />
        </svg>
        <span>{String(chapterCount).padStart(2, '0')}</span>
      </div>

      <section
        className="mobile-home-opening"
        data-mobile-home-chapter="0"
        data-mobile-home-surface="paper"
        aria-labelledby="mobile-home-name"
      >
        <div className="mobile-home-opening-sticky">
          <div className="mobile-home-portrait" aria-hidden="true">
            <Still
              src={PORTRAIT.src}
              alt=""
              position="52% 28%"
              sizes="82vw"
              priority
              className="absolute inset-0"
            />
            <svg className="mobile-home-opening-thread" viewBox="0 0 180 260" preserveAspectRatio="none">
              <path d="M128 0 C130 70 54 92 61 157 C67 213 128 206 113 260" />
              <circle cx="128" cy="7" r="3" />
              <circle cx="139" cy="7" r="3" />
            </svg>
          </div>

          <div className="mobile-home-opening-copy">
            <p className="mobile-home-role type-meta">{text.role}</p>
            <h2 id="mobile-home-name" className="mobile-home-name font-display">
              <span>Saël</span>
              <span>Simard</span>
            </h2>
            <p className="mobile-home-thesis">{thesis}</p>
            <Link href="#mobile-selected-work" className="mobile-home-descend no-underline">
              <span className="type-meta">{text.proof}</span>
              <span aria-hidden="true">↓</span>
            </Link>
          </div>

          <div className="mobile-home-opening-peek" aria-hidden="true">
            <span className="type-meta">{text.selected}</span>
            <span>{featured[0]?.title || (fr ? 'Œuvre' : 'Work')}</span>
          </div>
        </div>
      </section>

      <div id="mobile-selected-work" className="mobile-home-work-register">
        <p className="type-meta">{text.selected}</p>
        <span aria-hidden="true" />
      </div>

      {featured.map((project, index) => (
        <article
          key={project.slug}
          className="mobile-home-project"
          data-mobile-home-chapter={index + 1}
          data-mobile-home-surface="night"
          data-mobile-project-side={index % 2 === 0 ? 'left' : 'right'}
          style={{ '--mobile-project-accent': projectAccent(project) } as CSSProperties}
        >
          <div className="mobile-home-project-sticky">
            <RememberHold slug={project.slug} className="h-full">
              <Link href={`/${locale}/work/${project.slug}`} className="mobile-home-project-link no-underline">
                <MediaFigure
                  media={typeof project.hero === 'object' ? project.hero : null}
                  slug={project.slug}
                  title={project.title}
                  climate={project.climateHint || 'earth'}
                  className="mobile-home-project-media"
                  sizes="100vw"
                  priority={index === 0}
                  overlay={false}
                />
                <span className="mobile-home-project-shade" aria-hidden="true" />
                <span className="mobile-home-project-register">
                  <span className="type-meta">0{index + 1}</span>
                  <span className="type-meta">{authorshipLabel(project, locale)}</span>
                </span>
                <span className="mobile-home-project-copy">
                  <span className="type-meta">{[project.year, project.studio].filter(Boolean).join(' · ')}</span>
                  <strong className="font-display">{project.title}</strong>
                  <span className="mobile-home-project-lede">{project.lede}</span>
                  <span className="mobile-home-project-enter type-meta">
                    {text.enter}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
                <svg className="mobile-home-project-thread" viewBox="0 0 120 280" preserveAspectRatio="none" aria-hidden="true">
                  <path d={index % 2 === 0 ? 'M88 0 C91 72 28 90 34 154 C39 215 91 218 77 280' : 'M31 0 C25 70 88 96 81 154 C74 218 29 218 42 280'} />
                  <circle cx={index % 2 === 0 ? 34 : 81} cy="154" r="4" />
                </svg>
              </Link>
            </RememberHold>
          </div>
        </article>
      ))}

      <section
        className="mobile-home-depth"
        data-mobile-home-chapter={featured.length + 1}
        data-mobile-home-surface="paper"
        aria-labelledby="mobile-home-depth-title"
      >
        <svg className="mobile-home-depth-thread" viewBox="0 0 390 760" preserveAspectRatio="none" aria-hidden="true">
          <path d="M318 0 C325 168 72 162 78 340 C84 490 319 485 294 760" />
          <circle cx="78" cy="340" r="4" />
          <circle cx="294" cy="754" r="4" />
        </svg>
        <div className="mobile-home-depth-heading">
          <p className="type-meta">{text.beyond}</p>
          <h2 id="mobile-home-depth-title" className="font-display">{text.beyondCopy}</h2>
        </div>
        <Link href={`/${locale}/practice`} className="mobile-home-path mobile-home-path--practice no-underline">
          <Still
            src={SECTION.practice.src}
            alt={SECTION.practice.alt}
            credit={SECTION.practice.credit}
            sizes="88vw"
            className="mobile-home-path-image"
          />
          <span className="mobile-home-path-copy">
            <span className="type-meta">01 · {text.practice}</span>
            <strong className="font-display">{text.practiceCopy}</strong>
          </span>
        </Link>
        <MobileLabOrbit locale={locale} items={lab} />
      </section>

      <section
        className="mobile-home-closing"
        data-mobile-home-chapter={featured.length + 2}
        data-mobile-home-surface="night"
      >
        <div className="mobile-home-closing-orbit" aria-hidden="true">
          <span />
          <span />
        </div>
        <p className="type-meta">Saël Simard · Montréal</p>
        <h2 className="font-display">{text.closing}</h2>
        <div className="mobile-home-closing-actions">
          <Link href={`/${locale}/work`} className="mobile-home-primary-action no-underline">
            <span>{text.allWork}</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href={`/${locale}/contact`} className="mobile-home-secondary-action no-underline">
            {text.contact}
          </Link>
        </div>
      </section>
    </div>
  )
}
