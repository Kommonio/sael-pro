'use client'

import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/motion'
import { registerBridge } from '@/thread/camera'
import { reducedThread } from '@/thread/clock'
import { drawHead, drawStroke, resizeCanvas } from '@/thread/draw'
import { arrivePath, departPath } from '@/thread/journey'
import type { Vec } from '@/thread/math'
import { slicePolyline } from '@/thread/stroke'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function ThreadBridge() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const ptsRef = useRef<Vec[]>([])
  const tweenRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const node = canvas.current
    if (!node) return

    const size = () => resizeCanvas(node, window.innerWidth, window.innerHeight)
    let ctx = size()
    const onResize = () => {
      ctx = size()
    }
    window.addEventListener('resize', onResize)

    const paint = (end = 1) => {
      if (!ctx) return
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const pts = slicePolyline(ptsRef.current, 0, Math.max(0.001, end))
      if (pts.length > 1) {
        drawStroke(ctx, pts, 'spine', false, true)
        drawHead(ctx, pts[pts.length - 1], 'spine')
      }
    }

    const play = (pts: Vec[], duration: number, from = 0, at?: () => void, atTime = 0) =>
      new Promise<void>((resolve) => {
        tweenRef.current?.kill()
        ptsRef.current = pts
        const state = { t: from }
        paint(from)
        const tl = gsap.timeline({
          onComplete: () => {
            if (ptsRef.current === pts) paint(1)
            resolve()
          },
        })
        tl.to(
          state,
          {
            t: 1,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (ptsRef.current === pts) paint(state.t)
            },
          },
          0,
        )
        if (at) tl.add(at, atTime)
        tweenRef.current = tl
      })

    let departLock = Promise.resolve()

    registerBridge({
      depart: async (journey, go) => {
        node.classList.remove('is-idle')
        if (reducedThread()) {
          go()
          return
        }
        let release = () => {}
        departLock = new Promise<void>((resolve) => {
          release = resolve
        })
        const pts = departPath(journey.fromPoint, journey.heading, journey.to === 'home')
        const duration = journey.to === 'home' ? 1.05 : 0.82
        await play(pts, duration, 0, () => {
          ptsRef.current = []
          if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
          release()
          go()
        }, duration * 0.84)
        release()
      },
      arrive: async (land, journey) => {
        await departLock
        node.classList.remove('is-idle')
        if (reducedThread()) {
          if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
          node.classList.add('is-idle')
          return
        }
        ptsRef.current = []
        if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        const incoming = arrivePath(land, journey.heading)
        await play(incoming, 0.86, 0)
        void wait(80).then(async () => {
          node.classList.add('is-idle')
          await wait(400)
          if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
          ptsRef.current = []
        })
      },
    })

    return () => {
      tweenRef.current?.kill()
      window.removeEventListener('resize', onResize)
      registerBridge(null)
    }
  }, [])

  return <canvas ref={canvas} className="thread-bridge is-idle" aria-hidden="true" />
}
