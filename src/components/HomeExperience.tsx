'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useCondition } from '@/condition/ConditionProvider'
import type { Locale } from '@/i18n/config'
import { PORTRAIT } from '@/lib/covers'
import { t } from '@/lib/copy'
import { canPinRooms, gsap, registerMotion } from '@/lib/motion'
import { umlaut } from '@/lib/umlaut'

import type { ProjectCardData } from './ProjectCard'
import { Room } from './Room'
import { Still } from './Still'
import { BleedFrame } from './score/BleedFrame'
import { EventFrame } from './score/EventFrame'
import { FieldFrame } from './score/FieldFrame'
import { LineFrame } from './score/LineFrame'
import { ObjectFrame } from './score/ObjectFrame'
import { PrintFrame } from './score/PrintFrame'

export type LabCard = {
  slug: string
  year?: string | null
  url?: string | null
  title: string
  lede: string
}

export type PracticeStep = { label: string; text: string }

function pick(projects: ProjectCardData[], slug: string) {
  return projects.find((project) => project.slug === slug) || null
}

function PracticeWalk({ locale, steps }: { locale: Locale; steps: PracticeStep[] }) {
  const { reducedMotion } = useCondition()
  const [active, setActive] = useState(0)
  const [pin, setPin] = useState(false)
  const track = useRef<HTMLElement>(null)
  const step = steps[active] || steps[0]

  useEffect(() => {
    setPin(!reducedMotion && canPinRooms())
  }, [reducedMotion])

  useEffect(() => {
    if (!pin) return
    const onScroll = () => {
      const node = track.current
      if (!node) return
      const total = node.offsetHeight - window.innerHeight
      if (total <= 0) return
      const progress = Math.min(1, Math.max(0, -node.getBoundingClientRect().top / total))
      const next = Math.min(steps.length - 1, Math.floor(progress * steps.length))
      setActive((current) => {
        if (current !== next) void umlaut.flip()
        return next
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pin, steps.length])

  const choose = (index: number) => {
    if (index !== active) void umlaut.flip()
    setActive(index)
  }

  const body = (
    <div className="site-shell flex min-h-[calc(100svh-3.75rem)] flex-col justify-center py-16">
      <p className="type-meta text-ink/45">{locale === 'fr' ? 'Pratique' : 'Practice'}</p>
      <h2 className="type-display mt-5 max-w-4xl">
        {locale === 'fr' ? 'Comment une chose devient inévitable.' : 'How a thing becomes inevitable.'}
      </h2>
      <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
        <ol className="filter-row flex gap-2 md:col-span-4 md:flex-col md:gap-3">
          {steps.map((item, i) => (
            <li key={item.label}>
              <button
                type="button"
                className={`min-h-11 type-meta ${i === active ? 'text-ink' : 'text-ink/30'}`}
                onClick={() => choose(i)}
              >
                0{i + 1} {item.label}
              </button>
            </li>
          ))}
        </ol>
        <div className="md:col-span-8">
          <p className="font-display text-6xl leading-none md:text-8xl">{step.label}</p>
          <p className="mt-8 max-w-xl type-lede text-ink/70">{step.text}</p>
        </div>
      </div>
      <Link href={`/${locale}/practice`} className="mt-14 inline-block type-meta">
        {locale === 'fr' ? 'La grammaire' : 'The grammar'}
      </Link>
    </div>
  )

  if (!pin) {
    return (
      <section data-practice-walk className="relative">
        {body}
      </section>
    )
  }

  return (
    <section ref={track} data-practice-walk className="relative h-[240svh]">
      <div className="sticky top-[3.75rem]">{body}</div>
    </section>
  )
}

export function HomeExperience({
  locale,
  thesis,
  projects,
  lab,
  steps,
}: {
  locale: Locale
  thesis: string
  projects: ProjectCardData[]
  lab: LabCard[]
  steps: PracticeStep[]
}) {
  const labels = t(locale)
  const hero = useRef<HTMLElement>(null)
  const azul = pick(projects, 'azul-vivo')
  const trees = pick(projects, 'man-who-planted-trees')
  const onmove = pick(projects, 'onmove')
  const viventi = pick(projects, 'viventi-mori')
  const omega = pick(projects, 'omega-protocol')
  const contributions = projects.filter(
    (project) => project.authorship === 'contribution' && project.slug !== 'man-who-planted-trees',
  )

  useEffect(() => {
    registerMotion()
    const nodes = hero.current?.querySelectorAll('[data-reveal]')
    if (!nodes?.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(nodes, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, stagger: 0.1, ease: 'power3.out' })
    }, hero)
    return () => ctx.revert()
  }, [])

  return (
    <div>
      <Room id="hero" climate="earth" pinHeight="h-[140svh]">
        <section
          ref={hero}
          className="relative min-h-[100svh] pb-12 pt-[calc(4.5rem+env(safe-area-inset-top))] md:pb-16"
        >
          <div className="site-shell relative z-10 grid min-h-[calc(100svh-4.5rem)] items-start gap-8 md:grid-cols-12 md:items-center">
            <div className="md:hidden">
              <Still
                src={PORTRAIT.src}
                alt={PORTRAIT.alt}
                credit={PORTRAIT.credit}
                className="min-h-[42svh] w-full"
              />
            </div>
            <div className="md:col-span-6">
              <p data-reveal className="type-meta text-ink/45">
                Montréal
              </p>
              <h1 data-reveal className="type-hero mt-5">
                Saël Simard
              </h1>
              <p data-reveal className="type-display mt-8 max-w-xl">
                {thesis}
              </p>
            </div>
            <div className="hidden md:col-span-6 md:block">
              <div className="score-print-plate hero-plate">
                <Still
                  src={PORTRAIT.src}
                  alt={PORTRAIT.alt}
                  credit={PORTRAIT.credit}
                  className="min-h-[64svh] w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </Room>

      {azul ? (
        <Room id="azul" climate="sap" pinHeight="h-[180svh]" night verb="through">
          <BleedFrame project={azul} locale={locale} />
        </Room>
      ) : null}
      {trees ? (
        <Room id="trees" climate="moss" pinHeight="h-[150svh]" verb="cross">
          <PrintFrame project={trees} locale={locale} />
        </Room>
      ) : null}
      {onmove ? (
        <Room id="onmove" climate="moss" pinHeight="h-[150svh]" verb="cross">
          <FieldFrame project={onmove} locale={locale} />
        </Room>
      ) : null}
      {viventi ? (
        <Room id="viventi" climate="earth" pinHeight="h-[140svh]" verb="cross">
          <ObjectFrame project={viventi} locale={locale} />
        </Room>
      ) : null}
      {omega ? (
        <Room id="omega" climate="clay" pinHeight="h-[140svh]" night verb="through">
          <EventFrame project={omega} locale={locale} />
        </Room>
      ) : null}

      <PracticeWalk locale={locale} steps={steps} />

      {contributions.length ? (
        <section className="site-shell border-t border-ink/10 py-24">
          <p className="type-meta text-ink/45">{labels.contributions}</p>
          <ul className="mt-10">
            {contributions.map((project) => (
              <LineFrame key={project.slug} project={project} locale={locale} />
            ))}
          </ul>
        </section>
      ) : null}

      {lab.length ? (
        <section className="site-shell border-t border-ink/10 py-24">
          <p className="type-meta text-ink/45">{labels.lab}</p>
          <div className="mt-12 flex flex-col gap-14 md:flex-row md:gap-24">
            {lab.map((item) => (
              <a key={item.slug} href={item.url || `/${locale}/lab`} className="max-w-sm no-underline">
                <p className="type-meta text-ink/40">{item.year}</p>
                <p className="mt-3 font-display text-3xl leading-none">{item.title}</p>
                <p className="mt-4 text-ink/60">{item.lede}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="site-shell border-t border-ink/10 py-24 pb-[max(6rem,env(safe-area-inset-bottom))]">
        <p className="type-meta text-ink/45">Montréal</p>
        <p className="type-display mt-6 max-w-3xl">
          {locale === 'fr' ? 'Écrire. Voir le travail. Rester un moment.' : 'Write. See the work. Stay a moment.'}
        </p>
        <div className="mt-12 flex flex-wrap gap-10">
          <Link href={`/${locale}/about`} className="type-title">
            {labels.about}
          </Link>
          <Link href={`/${locale}/contact`} className="type-title">
            {labels.contact}
          </Link>
          <Link href={`/${locale}/work`} className="type-title">
            {labels.work}
          </Link>
        </div>
      </section>
    </div>
  )
}
