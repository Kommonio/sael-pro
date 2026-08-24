'use client'

import { useEffect, type RefObject } from 'react'

export function useMobileSurface(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767.98px)')
    let observer: IntersectionObserver | null = null

    const observe = () => {
      observer?.disconnect()
      observer = null
      if (!media.matches || !root.current) return

      const surfaces = Array.from(root.current.querySelectorAll<HTMLElement>('[data-mobile-surface]'))
      if (surfaces[0]?.dataset.mobileSurface) {
        document.documentElement.dataset.mobileSurface = surfaces[0].dataset.mobileSurface
      }
      observer = new IntersectionObserver(
        (entries) => {
          const candidate = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          const surface = (candidate?.target as HTMLElement | undefined)?.dataset.mobileSurface
          if (surface) document.documentElement.dataset.mobileSurface = surface
        },
        { rootMargin: '-8% 0px -82% 0px', threshold: 0 },
      )
      surfaces.forEach((surface) => observer?.observe(surface))
    }

    observe()
    media.addEventListener('change', observe)
    return () => {
      observer?.disconnect()
      media.removeEventListener('change', observe)
      delete document.documentElement.dataset.mobileSurface
    }
  }, [root])
}
