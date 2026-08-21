'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { useCondition } from '@/condition/ConditionProvider'
import type { ClimateHint } from '@/condition/types'
import { canPinRooms, gsap, registerMotion, ScrollTrigger } from '@/lib/motion'
import { umlaut } from '@/lib/umlaut'

export function Room({
  id,
  climate,
  pinHeight,
  night = false,
  verb,
  children,
}: {
  id: string
  climate: ClimateHint
  pinHeight: string
  night?: boolean
  verb?: 'through' | 'cross'
  children: ReactNode
}) {
  const { setClimateNow, reducedMotion } = useCondition()
  const track = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [pin, setPin] = useState(false)

  useEffect(() => {
    setPin(!reducedMotion && canPinRooms())
  }, [reducedMotion])

  useEffect(() => {
    registerMotion()
    let spoken = false
    const enter = (replay = false) => {
      setClimateNow(climate)
      document.documentElement.dataset.header = night ? 'over-night' : 'paper'
      track.current?.classList.add('is-open')
      if (replay || spoken) return
      spoken = true
      if (verb === 'through' || verb === 'cross') void umlaut.cross()
    }

    if (!pin) {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) enter()
        },
        { threshold: 0.45 },
      )
      if (track.current) io.observe(track.current)
      return () => io.disconnect()
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: inner.current,
        pinSpacing: false,
        anticipatePin: 1,
        scrub: 0.65,
        invalidateOnRefresh: true,
        id,
        onEnter: () => enter(),
        onEnterBack: () => enter(true),
      })
    }, track)

    return () => ctx.revert()
  }, [climate, night, reducedMotion, verb, id, setClimateNow, pin])

  return (
    <section ref={track} data-room={id} className={`relative ${pin ? pinHeight : ''}`}>
      <div ref={inner} className={pin ? 'flex h-svh flex-col overflow-hidden' : ''}>
        {children}
      </div>
    </section>
  )
}
