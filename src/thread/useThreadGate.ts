'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { registerThread, threadNav } from '@/thread/camera'
import { reducedThread } from '@/thread/clock'
import {
  beginJourney,
  endJourney,
  gateFromHref,
  gateFromPath,
  headingFor,
  takeJourneyArrival,
} from '@/thread/journey'

export function landFromNode(node: HTMLElement | null) {
  if (!node) return { x: window.innerWidth * 0.28, y: window.innerHeight * 0.42 }
  const rect = node.getBoundingClientRect()
  return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 }
}

export function useThreadGate(landRef: { current: HTMLElement | null }) {
  const router = useRouter()

  useEffect(() => {
    const point = () => landFromNode(landRef.current)
    registerThread({
      landPoint: () => point(),
      travel: async (id, href) => {
        if (!href) return null
        const fromPoint = point()
        if (reducedThread()) {
          router.push(href)
          return fromPoint
        }
        router.prefetch(href)
        const from = gateFromPath(window.location.pathname)
        const to = gateFromHref(href)
        const journey = beginJourney({
          from,
          to,
          via: id,
          fromPoint,
          heading: headingFor(from, to),
          href,
        })
        const api = threadNav.bridge()
        if (api) await api.depart(journey, () => router.push(href))
        else router.push(href)
        return fromPoint
      },
    })
    const journey = takeJourneyArrival()
    if (journey) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          void threadNav
            .bridge()
            ?.arrive(point(), journey)
            .then(() => endJourney())
        })
      })
    }
    return () => registerThread(null)
  }, [landRef, router])
}
