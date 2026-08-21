'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { killMotion, registerMotion, syncLenis } from '@/lib/motion'

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      killMotion()
      return
    }

    registerMotion()
    let unsync: (() => void) | null = null
    let lenis: { destroy: () => void } | null = null

    void import('lenis').then(({ default: Lenis }) => {
      const instance = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      })
      lenis = instance
      unsync = syncLenis(instance)
      requestAnimationFrame(() => {
        void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh()
        })
      })
    })

    return () => {
      unsync?.()
      lenis?.destroy()
      killMotion()
    }
  }, [pathname])

  return null
}
