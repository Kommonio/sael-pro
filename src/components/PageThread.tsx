'use client'

import { useCallback, useRef, type ReactNode } from 'react'

import type { Locale } from '@/i18n/config'
import { SECTION } from '@/lib/covers'
import { contactGraph, labGraph } from '@/thread/recipes'

import { Still } from './Still'
import { ThreadCanvas } from './ThreadCanvas'
import { useMobileSurface } from './useMobileSurface'

type LabItem = { slug: string; title: string; year?: string | null; url?: string | null; lede?: string }

function LabCard({ item, index, enter }: { item: LabItem; index: number; enter: string }) {
  const content = (
    <>
      <span className="mobile-lab-card-register">
        <span className="type-meta">{String(index + 1).padStart(2, '0')}</span>
        <span className="type-meta">{item.year}</span>
      </span>
      <strong className="font-display">{item.title}</strong>
      {item.lede ? <span className="mobile-lab-card-lede">{item.lede}</span> : null}
      {item.url ? <span className="mobile-lab-card-enter type-meta">{enter} ↗</span> : null}
    </>
  )
  if (item.url) {
    return (
      <a href={item.url} className="mobile-lab-card no-underline" data-mobile-lab-side={index % 2 ? 'right' : 'left'}>
        {content}
      </a>
    )
  }
  return (
    <article className="mobile-lab-card" data-mobile-lab-side={index % 2 ? 'right' : 'left'}>
      {content}
    </article>
  )
}

function MobileLabIndex({ locale, items }: { locale: Locale; items: LabItem[] }) {
  const fr = locale === 'fr'
  const root = useRef<HTMLElement>(null)
  useMobileSurface(root)
  return (
    <section ref={root} className="mobile-lab-index" aria-labelledby="mobile-lab-title">
      <header className="mobile-lab-opening" data-mobile-surface="night">
        <Still
          src={SECTION.lab.src}
          alt={SECTION.lab.alt}
          credit={SECTION.lab.credit}
          sizes="100vw"
          priority
          className="mobile-lab-opening-image"
        />
        <span className="mobile-lab-opening-shade" aria-hidden="true" />
        <svg viewBox="0 0 390 640" preserveAspectRatio="none" aria-hidden="true">
          <path d="M314 0 C325 142 71 167 80 330 C88 482 301 475 279 640" />
        </svg>
        <div>
          <p className="type-meta">{fr ? 'Expériences · outils · prototypes' : 'Experiments · tools · prototypes'}</p>
          <h2 id="mobile-lab-title" className="font-display">{fr ? 'Labo' : 'Lab'}</h2>
          <p>
            {fr
              ? 'Des systèmes partiels construits pour découvrir ce que le système final doit devenir.'
              : 'Partial systems built to discover what the final system needs to become.'}
          </p>
        </div>
      </header>
      <div className="mobile-lab-field" data-mobile-surface="paper">
        <svg viewBox="0 0 390 1200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M280 0 C294 178 69 192 83 395 C98 588 305 592 288 806 C275 975 89 987 101 1200" />
        </svg>
        {items.map((item, index) => (
          <LabCard key={item.slug} item={item} index={index} enter={fr ? 'Ouvrir' : 'Open'} />
        ))}
      </div>
    </section>
  )
}

export function LabThread({
  locale,
  items,
}: {
  locale: Locale
  items: { slug: string; title: string; year?: string | null; url?: string | null; lede?: string }[]
}) {
  const build = useCallback(() => labGraph(locale, items), [locale, items])
  return (
    <>
      <div className="lab-thread-canvas">
        <ThreadCanvas build={build} />
      </div>
      <MobileLabIndex locale={locale} items={items} />
    </>
  )
}

export function ContactThread({
  locale,
  title,
  after,
}: {
  locale: Locale
  title: string
  after?: ReactNode
}) {
  const build = useCallback(() => contactGraph(locale, title), [locale, title])
  const mobile = useRef<HTMLDivElement>(null)
  useMobileSurface(mobile)
  return (
    <>
      <div className="contact-thread-canvas">
        <ThreadCanvas build={build} />
      </div>
      <div ref={mobile} className="mobile-contact-experience">
        <section className="mobile-contact-opening" data-mobile-surface="paper" aria-labelledby="mobile-contact-title">
          <svg viewBox="0 0 390 620" preserveAspectRatio="none" aria-hidden="true">
            <path d="M68 0 C45 146 315 149 301 318 C286 482 87 476 104 620" />
            <circle cx="301" cy="318" r="4" />
          </svg>
          <div>
            <p className="type-meta">{locale === 'fr' ? 'Correspondance · Montréal' : 'Correspondence · Montréal'}</p>
            <h2 id="mobile-contact-title" className="font-display">{title}</h2>
            <p className="type-meta">{locale === 'fr' ? 'Le message peut être simple.' : 'The message can be simple.'}</p>
          </div>
        </section>
        <div className="contact-after" data-mobile-surface="night">{after}</div>
      </div>
    </>
  )
}
