'use client'

import { useEffect } from 'react'

export function NightWhenInView({ slug }: { slug: string }) {
  useEffect(() => {
    const node = document.querySelector(`[data-attend="${slug}"]`)
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.dataset.header = entry.isIntersecting ? 'over-night' : 'paper'
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      document.documentElement.dataset.header = 'paper'
    }
  }, [slug])
  return null
}
