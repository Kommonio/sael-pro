'use client'

import { useEffect, useRef } from 'react'

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void import('gsap').then(({ default: gsap }) => {
      gsap.fromTo(
        node.querySelectorAll('[data-reveal]'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, stagger: 0.12, ease: 'power3.out' },
      )
    })
  }, [])

  return <div ref={ref}>{children}</div>
}
