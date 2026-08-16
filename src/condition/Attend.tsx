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
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.current = true
          started.current = performance.now()
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
      { threshold: 0.45 },
    )
    io.observe(node)
    return () => {
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

  return <span data-attend={slug} className="sr-only" />
}
