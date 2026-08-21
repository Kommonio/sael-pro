'use client'

import { useEffect, useRef } from 'react'

import { useCondition } from './ConditionProvider'
import type { Authorship, ClimateHint } from './types'

type Props = {
  slug: string
  title: string
  authorship: Authorship
  climateHint: ClimateHint
}

export function Attend({ slug, title, authorship, climateHint }: Props) {
  const { attend } = useCondition()
  const visible = useRef(false)
  const started = useRef(0)

  useEffect(() => {
    const node = document.querySelector(`[data-attend="${slug}"]`) || document.body
    const tick = window.setInterval(() => {
      if (!visible.current) return
      attend({
        slug,
        title,
        authorship,
        climateHint,
        dwellMs: 1000,
      })
    }, 1000)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.current = true
          started.current = performance.now()
          attend({
            slug,
            title,
            authorship,
            climateHint,
            dwellMs: 0,
          })
        } else if (visible.current) {
          visible.current = false
          attend({
            slug,
            title,
            authorship,
            climateHint,
            dwellMs: performance.now() - started.current,
          })
        }
      },
      { threshold: 0.45, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(node)
    return () => {
      window.clearInterval(tick)
      if (visible.current) {
        attend({
          slug,
          title,
          authorship,
          climateHint,
          dwellMs: performance.now() - started.current,
        })
      }
      io.disconnect()
    }
  }, [attend, authorship, climateHint, slug, title])

  return <span data-attend-probe={slug} className="sr-only" />
}
