'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import type { Locale } from '@/i18n/config'

export type MobileOrbitItem = {
  slug: string
  title: string
  year?: string | null
  url?: string | null
}

type MobileOrbitKind = 'lab' | 'work'

function orbitPoint(index: number, count: number, phase: number) {
  const angle = phase + (index / Math.max(1, count)) * Math.PI * 2
  const depth = (Math.sin(angle) + 1) / 2
  return {
    x: 50 + Math.cos(angle) * 38 + Math.sin(angle * 2) * 3.5,
    y: 52 + Math.sin(angle) * 34 + Math.cos(angle * 3) * 2.5,
    depth,
  }
}

function MobileOrbitField({
  locale,
  items,
  kind,
}: {
  locale: Locale
  items: MobileOrbitItem[]
  kind: MobileOrbitKind
}) {
  const field = useRef<HTMLElement>(null)
  const nodes = useRef<Array<HTMLAnchorElement | null>>([])

  useEffect(() => {
    const host = field.current
    if (!host || !items.length) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767.98px)')
    let frame = 0
    let visible = false
    let phase = 0.32
    let target = phase
    let lastTime = performance.now()
    let lastScrollY = window.scrollY
    let pointerID: number | null = null
    let pointerStartX = 0
    let pointerStartY = 0
    let pointerStartPhase = 0
    let pointerLastX = 0
    let pointerLastTime = 0
    let velocity = 0
    let suppressClick = false
    let focusPaused = false

    const render = () => {
      nodes.current.forEach((node, index) => {
        if (!node) return
        const point = orbitPoint(index, items.length, phase)
        const scale = 0.76 + point.depth * 0.27
        node.style.left = `${point.x}%`
        node.style.top = `${point.y}%`
        node.style.opacity = `${0.38 + point.depth * 0.62}`
        node.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`
        node.style.zIndex = String(2 + Math.round(point.depth * 8))
        node.style.setProperty('--lab-node-depth', String(point.depth))
      })
    }

    const tick = (time: number) => {
      const elapsed = Math.min(40, time - lastTime)
      lastTime = time
      if (visible && mobile.matches && !reducedMotion.matches) {
        if (pointerID === null && !focusPaused) {
          target += elapsed * 0.000075 + velocity
          velocity *= 0.92
        }
        phase += (target - phase) * 0.085
        render()
      }
      frame = window.requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const nextY = window.scrollY
      const delta = nextY - lastScrollY
      lastScrollY = nextY
      if (visible && pointerID === null && !reducedMotion.matches) {
        target += delta * 0.0038
        velocity += delta * 0.000018
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches || event.button !== 0) return
      pointerID = event.pointerId
      pointerStartX = event.clientX
      pointerStartY = event.clientY
      pointerLastX = event.clientX
      pointerLastTime = performance.now()
      pointerStartPhase = target
      velocity = 0
      suppressClick = false
      host.dataset.orbitDragging = 'true'
      host.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (pointerID !== event.pointerId) return
      const deltaX = event.clientX - pointerStartX
      const deltaY = event.clientY - pointerStartY
      if (Math.abs(deltaX) < 4 || Math.abs(deltaX) < Math.abs(deltaY) * 0.72) return
      const now = performance.now()
      const elapsed = Math.max(8, now - pointerLastTime)
      velocity = ((event.clientX - pointerLastX) * 0.011) / elapsed
      target = pointerStartPhase + deltaX * 0.011
      pointerLastX = event.clientX
      pointerLastTime = now
      suppressClick = Math.abs(deltaX) > 8
    }

    const releasePointer = (event: PointerEvent) => {
      if (pointerID !== event.pointerId) return
      target += velocity * 180
      pointerID = null
      delete host.dataset.orbitDragging
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
    }

    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    const onFocusIn = () => {
      focusPaused = true
    }

    const onFocusOut = (event: FocusEvent) => {
      focusPaused = Boolean(event.relatedTarget && host.contains(event.relatedTarget as Node))
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
      },
      { rootMargin: '25% 0px' },
    )

    render()
    host.dataset.orbitReady = 'true'
    host.dataset[`${kind}OrbitReady`] = 'true'
    observer.observe(host)
    window.addEventListener('scroll', onScroll, { passive: true })
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerup', releasePointer)
    host.addEventListener('pointercancel', releasePointer)
    host.addEventListener('click', onClick, true)
    host.addEventListener('focusin', onFocusIn)
    host.addEventListener('focusout', onFocusOut)
    frame = window.requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerup', releasePointer)
      host.removeEventListener('pointercancel', releasePointer)
      host.removeEventListener('click', onClick, true)
      host.removeEventListener('focusin', onFocusIn)
      host.removeEventListener('focusout', onFocusOut)
      delete host.dataset.orbitDragging
      delete host.dataset.orbitReady
      delete host.dataset[`${kind}OrbitReady`]
    }
  }, [items.length, kind])

  const lab = kind === 'lab'
  const label = lab
    ? locale === 'fr'
      ? 'Projets du labo'
      : 'Lab projects'
    : locale === 'fr'
      ? 'Toutes les œuvres'
      : 'All works'
  const coreHref = lab ? `/${locale}/lab` : `/${locale}/work`
  const coreLabel = lab ? 'LAB' : locale === 'fr' ? 'TOUTES LES ŒUVRES' : 'ALL WORKS'

  return (
    <section
      ref={field}
      className={`mobile-home-orbit mobile-home-${kind}-orbit`}
      aria-label={label}
      data-orbit-kind={kind}
    >
      <svg className="mobile-home-orbit-thread" viewBox="0 0 360 440" preserveAspectRatio="none" aria-hidden="true">
        <path className="mobile-home-orbit-thread-ghost" d="M43 231 C17 105 130 40 245 73 C348 103 373 254 285 344 C202 427 52 368 43 231 Z" />
        <path className="mobile-home-orbit-thread-live" d="M43 231 C17 105 130 40 245 73 C348 103 373 254 285 344 C202 427 52 368 43 231 Z" pathLength="1" />
        <circle cx="177" cy="215" r="3.5" />
        <circle cx="188" cy="215" r="3.5" />
      </svg>

      <Link href={coreHref} className="mobile-home-orbit-core no-underline" aria-label={label}>
        <span>{coreLabel}</span>
        <span className="mobile-home-orbit-core-mark" aria-hidden="true"><i /><i /></span>
      </Link>

      <div className="mobile-home-orbit-nodes">
        {items.map((item, index) => {
          const point = orbitPoint(index, items.length, 0.32)
          return (
            <a
              key={item.slug}
              ref={(node) => { nodes.current[index] = node }}
              href={item.url || `/${locale}/lab`}
              className={`mobile-home-orbit-node ${lab ? 'mobile-home-lab-node' : 'mobile-home-work-orbit-node'} no-underline`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                opacity: 0.38 + point.depth * 0.62,
                transform: `translate3d(-50%, -50%, 0) scale(${0.76 + point.depth * 0.27})`,
                zIndex: 2 + Math.round(point.depth * 8),
              }}
            >
              <span aria-hidden="true" />
              <strong>{item.title}</strong>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export function MobileLabOrbit({ locale, items }: { locale: Locale; items: MobileOrbitItem[] }) {
  return <MobileOrbitField locale={locale} items={items} kind="lab" />
}

export function MobileWorkOrbit({ locale, items }: { locale: Locale; items: MobileOrbitItem[] }) {
  return <MobileOrbitField locale={locale} items={items} kind="work" />
}
