'use client'

import { useEffect, useRef, useState } from 'react'

import type { Locale } from '@/i18n/config'

import { FeaturedHang } from './FeaturedHang'
import type { ProjectCardData } from './ProjectCard'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function range(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start))
}

export function LandingStage({
  locale,
  thesis,
  room,
}: {
  locale: Locale
  thesis: string
  lead?: ProjectCardData
  room: ProjectCardData[]
}) {
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.landing = '1'
    return () => {
      delete document.documentElement.dataset.landing
    }
  }, [])

  useEffect(() => {
    if (reduced) return

    const apply = (next: number) => {
      const value = clamp(next)
      progressRef.current = value
      setProgress(value)
    }

    const onWheel = (event: WheelEvent) => {
      if (document.getElementById('mobile-nav')) return
      event.preventDefault()
      apply(progressRef.current + event.deltaY / (window.innerHeight * 2.4))
    }

    let touchY = 0
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      if (document.getElementById('mobile-nav')) return
      const y = event.touches[0]?.clientY ?? touchY
      const delta = touchY - y
      touchY = y
      if (Math.abs(delta) < 0.5) return
      event.preventDefault()
      apply(progressRef.current + delta / (window.innerHeight * 2))
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        apply(progressRef.current + 0.14)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        apply(progressRef.current - 0.14)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [reduced])

  const roomIn = reduced ? 1 : range(progress, 0.42, 0.68)

  const labels =
    locale === 'fr'
      ? 'Architecte de systèmes · Technologue créatif · Créateur de médias immersifs'
      : 'System Architect · Creative Technologist · Immersive Media Creator'

  if (reduced) {
    return (
      <div className="px-5 pb-16 pt-10 md:px-12">
        <p className="type-meta text-ink/50">Montréal</p>
        <h1 className="mt-6 font-display text-6xl leading-[0.86] sm:text-8xl">Saël Simard</h1>
        <p className="mt-5 type-meta text-ink/55">{labels}</p>
        <p className="type-display mt-10 max-w-4xl">{thesis}</p>
        <div className="mt-16">
          <FeaturedHang locale={locale} projects={room} />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100svh - 4.35rem)',
        overflow: 'hidden',
        background: '#f1e8d4',
      }}
    >
      <div
        className="absolute inset-0 flex flex-col justify-end px-5 pb-12 md:justify-center md:px-16 md:pb-0"
        style={{ opacity: 1 - roomIn, pointerEvents: roomIn > 0.35 ? 'none' : 'auto' }}
      >
        <p className="type-meta text-ink/50">Montréal</p>
        <h1 className="mt-5 font-display text-6xl leading-[0.86] text-ink sm:text-8xl md:text-9xl">Saël Simard</h1>
        <p className="mt-5 type-meta text-ink/50">{labels}</p>
        <p className="type-display mt-10 max-w-4xl text-ink">{thesis}</p>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: '#f1e8d4',
          opacity: roomIn,
          pointerEvents: roomIn > 0.35 ? 'auto' : 'none',
        }}
      >
        <div className="h-full px-3 pb-5 pt-4 md:px-6">
          {roomIn > 0.08 ? <FeaturedHang locale={locale} projects={room} /> : null}
        </div>
      </div>
    </div>
  )
}
