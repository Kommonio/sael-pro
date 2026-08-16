'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let lenis: { destroy: () => void; raf: (time: number) => void } | null = null
    let raf = 0
    void import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
      })
      const loop = (time: number) => {
        lenis?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])
  return null
}
