'use client'

import { useRef, type ReactNode } from 'react'

import type { Cover } from '@/lib/covers'
import { useThreadGate } from '@/thread/useThreadGate'

import { StillFigure } from './StillFigure'

export function EssayBody({ text }: { text?: string | null }) {
  if (!text) return null
  return (
    <>
      {text
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, i) => (
          <p key={i} className="essay-copy">
            {paragraph}
          </p>
        ))}
    </>
  )
}

export function EssayStill({ cover, align = 'right' }: { cover: Cover; align?: 'left' | 'right' }) {
  return (
    <div className={`essay-still essay-still--${align}`}>
      <StillFigure cover={cover} size="md" />
    </div>
  )
}

export function EssaySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="essay-section">
      <h2 className="type-title">{title}</h2>
      {children}
    </section>
  )
}

export function ContentEssay({
  still,
  meta,
  title,
  lede,
  children,
}: {
  still?: Cover | null
  meta?: string
  title: string
  lede?: string
  children: ReactNode
}) {
  const land = useRef<HTMLElement>(null)
  useThreadGate(land)

  return (
    <article className="content-page">
      <header className="content-land site-shell">
        {still ? <StillFigure ref={land} cover={still} size="xl" /> : <span ref={land} className="content-land-mark" />}
        <div>
          {meta ? <p className="type-meta text-muted">{meta}</p> : null}
          <h1 className="type-display mt-4">{title}</h1>
          {lede ? <p className="type-lede mt-7 text-ink/75">{lede}</p> : null}
        </div>
      </header>
      <div className="content-essay site-shell">{children}</div>
    </article>
  )
}
