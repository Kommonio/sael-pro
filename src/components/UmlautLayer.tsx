'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/motion'
import { markPair, registerUmlaut, reducedUmlaut } from '@/lib/umlaut'

type Dot = HTMLSpanElement

function place(el: Dot, x: number, y: number, size: number, opacity = 0) {
  gsap.set(el, {
    x,
    y,
    xPercent: -50,
    yPercent: -50,
    width: size,
    height: size,
    opacity,
    scale: 1,
  })
}

export function UmlautLayer() {
  const pathname = usePathname()
  const a = useRef<HTMLSpanElement>(null)
  const b = useRef<HTMLSpanElement>(null)
  const axis = useRef<HTMLSpanElement>(null)
  const active = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const dotA = a.current
    const dotB = b.current
    const line = axis.current
    if (!dotA || !dotB || !line) return
    const dots = { a: dotA, b: dotB, axis: line }

    const rest = () => {
      active.current?.kill()
      active.current = null
      const pair = markPair()
      place(dots.a, pair.a.x, pair.a.y, 7, 0)
      place(dots.b, pair.b.x, pair.b.y, 7, 0)
      gsap.set(line, { opacity: 0, scaleX: 0, visibility: 'hidden' })
    }

    const play = (build: (tl: gsap.core.Timeline) => void) => {
      if (reducedUmlaut()) {
        rest()
        return Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        const tl = gsap.timeline({
          onComplete: () => {
            rest()
            resolve()
          },
        })
        active.current = tl
        build(tl)
      })
    }

    const through = () =>
      play((tl) => {
        const from = markPair()
        const ax = window.innerWidth * 0.38
        const bx = window.innerWidth * 0.62
        const ay = window.innerHeight * 0.42
        const by = window.innerHeight * 0.44
        place(dots.a, from.a.x, from.a.y, 8, 1)
        place(dots.b, from.b.x, from.b.y, 8, 1)
        tl.to(dots.a, { x: ax, y: ay, width: 44, height: 44, duration: 0.42, ease: 'power3.inOut' }, 0)
          .to(dots.b, { x: bx, y: by, width: 44, height: 44, duration: 0.42, ease: 'power3.inOut' }, 0)
          .to([dots.a, dots.b], { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0.4)
      })

    const flip = () =>
      play((tl) => {
        const pair = markPair()
        place(dots.a, pair.a.x, pair.a.y, 8, 1)
        place(dots.b, pair.b.x, pair.b.y, 8, 1)
        tl.to(dots.a, { x: pair.b.x, y: pair.b.y, duration: 0.4, ease: 'power3.inOut' }, 0)
          .to(dots.b, { x: pair.a.x, y: pair.a.y, duration: 0.4, ease: 'power3.inOut' }, 0)
          .to([dots.a, dots.b], { opacity: 0, duration: 0.14 }, 0.32)
      })

    const cross = () =>
      play((tl) => {
        const pair = markPair()
        const dx = pair.b.x - pair.a.x
        const dy = pair.b.y - pair.a.y
        const length = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        place(dots.a, pair.a.x, pair.a.y, 6, 1)
        place(dots.b, pair.b.x, pair.b.y, 6, 1)
        gsap.set(line, {
          x: pair.a.x,
          y: pair.a.y,
          width: length,
          opacity: 0.7,
          visibility: 'visible',
          scaleX: 0,
          rotation: (angle * 180) / Math.PI,
        })
        tl.to(line, { scaleX: 1, duration: 0.14, ease: 'power2.out' }, 0)
          .to(dots.a, { scale: 1.25, duration: 0.16 }, 0.1)
          .to(dots.b, { scale: 0.75, duration: 0.16 }, 0.1)
          .to(dots.a, { scale: 1, duration: 0.16 }, 0.26)
          .to(dots.b, { scale: 1, duration: 0.16 }, 0.26)
          .to([dots.a, dots.b, line], { opacity: 0, duration: 0.14 }, 0.36)
      })

    const land = (target?: DOMRect | 'header') =>
      play((tl) => {
        const pair = markPair()
        const end =
          target && target !== 'header'
            ? {
                a: { x: target.right - 28, y: target.top + 22 },
                b: { x: target.right - 16, y: target.top + 28 },
              }
            : pair
        place(dots.a, pair.a.x, pair.a.y, 7, 1)
        place(dots.b, pair.b.x, pair.b.y, 7, 1)
        tl.to(dots.a, { x: end.a.x, y: end.a.y, duration: 0.4, ease: 'power3.inOut' }, 0)
          .to(dots.b, { x: end.b.x, y: end.b.y, duration: 0.4, ease: 'power3.inOut' }, 0)
          .to([dots.a, dots.b], { opacity: 0, duration: 0.16 }, 0.32)
      })

    rest()
    registerUmlaut({
      through,
      flip,
      cross,
      land,
      kill: rest,
    })
    return () => {
      rest()
      registerUmlaut(null)
    }
  }, [pathname])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      <span
        ref={axis}
        className="absolute left-0 top-0 h-px origin-left bg-[var(--ochre)]"
        style={{ width: 1, opacity: 0, visibility: 'hidden' }}
      />
      <span
        ref={a}
        className="absolute left-0 top-0 rounded-full bg-[var(--ochre)]"
        style={{ width: 7, height: 7, opacity: 0 }}
      />
      <span
        ref={b}
        className="absolute left-0 top-0 rounded-full bg-[var(--ochre)]"
        style={{ width: 7, height: 7, opacity: 0 }}
      />
    </div>
  )
}
