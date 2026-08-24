'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { ThreadNode } from '@/components/ThreadNode'
import { gsap } from '@/lib/motion'
import { registerThread, threadNav } from '@/thread/camera'
import { THREAD_ENHANCED_MEDIA } from '@/thread/breakpoint'
import { focusY, leadY, reducedThread, reducedThreadTravel, trackAtStart } from '@/thread/clock'
import { drawDot, drawHead, drawPair, drawStroke, resizeCanvas } from '@/thread/draw'
import type { CompiledGraph, PlacedNode } from '@/thread/graph'
import { scaleGraph } from '@/thread/graph'
import { inspectLayout, nodesShownByThread } from '@/thread/inspect'
import { gapByMasks, type InkMask } from '@/thread/gap'
import {
  beginJourney,
  endJourney,
  gateFromHref,
  gateFromPath,
  headingFor,
  headingFromScene,
  incomingSpanIndex,
  landNodeId,
  peekArrivalHold,
  peekArrivalStamp,
  peekJourney,
  releaseArrivalHold,
  stampArrival,
  takeJourneyArrival,
} from '@/thread/journey'
import { sliceByLead } from '@/thread/stroke'

function viewportPoint(track: HTMLDivElement, x: number, y: number) {
  const rect = track.getBoundingClientRect()
  return { x: rect.left + x, y: rect.top + y }
}

export function ThreadCanvas({
  build,
  filters,
  after,
  empty,
  intro,
  context,
}: {
  build: (width: number) => CompiledGraph
  filters?: ReactNode
  after?: ReactNode
  empty?: ReactNode
  intro?: string
  context?: 'home' | 'work' | 'lab' | 'contact'
}) {
  const router = useRouter()
  const mobileMaskId = `mobile-thread-mask-${useId().replace(/:/g, '')}`
  const track = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const mobileThread = useRef<SVGSVGElement>(null)
  const [graph, setGraph] = useState<CompiledGraph | null>(() => build(1000))
  const graphRef = useRef<CompiledGraph | null>(graph)
  const holdRef = useRef(peekArrivalHold())
  const landIdRef = useRef<string | null>(null)
  const currentRef = useRef<string[]>(intro ? [intro] : [])
  const [open, setOpen] = useState<string[]>(intro ? [intro] : [])
  const [view, setView] = useState({ width: 1000, height: 800 })

  useEffect(() => {
    const layout = () => {
      const host = track.current
      const width = host?.clientWidth || window.innerWidth
      const here = gateFromPath(window.location.pathname)
      const journey = peekJourney()
      const stamp = peekArrivalStamp()
      let next = scaleGraph(build(1000), width)
      const land = journey && (here === journey.to || here === gateFromHref(journey.href))
        ? landNodeId(next, journey)
        : stamp && stamp.to === here
          ? next.nodes.find((node) => node.id === stamp.nodeId)?.id ||
            (stamp.to === 'home' ? null : next.nodes[0]?.id || null)
          : null
      landIdRef.current = land
      const heading = journey?.heading || stamp?.heading
      const to = journey?.to || stamp?.to
      if (heading && to && to !== 'home' && to === here && land && host) {
        const item = next.nodes.find((node) => node.id === land)
        if (item) {
          const rect = host.getBoundingClientRect()
          next = stampArrival(next, land, viewportPoint(host, item.x, item.y), heading, {
            x: rect.left,
            y: rect.top,
          })
        }
      }
      graphRef.current = next
      setGraph(next)
      setView({ width, height: window.innerHeight })
      if (land) {
        currentRef.current = [land]
        setOpen([land])
      } else {
        const shown = nodesShownByThread(
          next.nodes,
          host ? focusY(host) : next.nodes[0]?.y || 0,
          undefined,
          host ? trackAtStart(host) : true,
          currentRef.current,
        )
        currentRef.current = shown
        setOpen(shown)
      }
    }
    layout()
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [build])

  useEffect(() => {
    const host = track.current
    const current = graphRef.current
    const journey = takeJourneyArrival()
    if (!host || !current || !journey) return
    const id = landNodeId(current, journey)
    landIdRef.current = id
    holdRef.current = true
    const item = current.nodes.find((node) => node.id === id)
    if (item && journey.to === 'home') {
      const top = item.y - window.innerHeight * 0.38
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
    }
    const land = item
      ? viewportPoint(host, item.x, item.y)
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.28 }
    void threadNav
      .bridge()
      ?.arrive(land, journey)
      .then(() => {
        endJourney()
      })
  }, [graph])

  useEffect(() => {
    const node = canvas.current
    const host = track.current
    const g = graph
    if (!node || !host || !g) return
    if (!window.matchMedia(THREAD_ENHANCED_MEDIA).matches) return
    const ctx = resizeCanvas(node, g.width, g.height)
    if (!ctx) return

    const paint = () => {
      const current = graphRef.current
      if (!current) return
      if (holdRef.current && !trackAtStart(host)) {
        holdRef.current = false
        releaseArrivalHold()
      } else if (peekArrivalHold()) {
        holdRef.current = true
      }

      const landId = landIdRef.current || current.nodes[0]?.id
      const holdTo = holdRef.current && landId ? incomingSpanIndex(current, landId) : null
      const lead = reducedThread()
        ? current.height + 80
        : holdTo != null
          ? (current.nodes.find((item) => item.id === landId)?.y || 0) + 8
          : leadY(host)

      ctx.clearRect(0, 0, current.width, current.height)

      const traveling = peekJourney()
      if (traveling && gateFromPath(window.location.pathname) === traveling.to) {
        return
      }

      const shown = nodesShownByThread(
        current.nodes,
        focusY(host),
        undefined,
        trackAtStart(host) || holdRef.current,
        currentRef.current,
      )

      const masks: InkMask[] = current.nodes.flatMap((node) => {
        const grown = shown.includes(node.id)
        const layout = inspectLayout(node, current.width, window.innerHeight, grown)
        const disc: InkMask = { kind: 'disc', x: node.x, y: node.y, r: layout.disc / 2 + (grown ? 5 : 3) }
        if (!grown) return [disc]
        return [
          disc,
          {
            kind: 'box',
            x: node.x + layout.copyX - 8,
            y: node.y + layout.copyY - 6,
            w: layout.copyW + 16,
            h: layout.copyH + 56,
          },
        ]
      })

      let head = current.start.a
      const tips: { x: number; y: number; weight: (typeof current.spans)[number]['weight'] }[] = []

      current.spans.forEach((span, i) => {
        if (holdTo != null && i > holdTo) return
        const bias = span.weight === 'spine' ? 96 : span.weight === 'branch' ? 12 : 0
        const pts =
          holdTo != null && i === holdTo
            ? span.points
            : reducedThread()
              ? span.points
              : sliceByLead(span.points, lead + bias)
        if (pts.length < 2) return
        const done = holdTo != null || pts.length >= span.points.length
        const pieces = gapByMasks(pts, masks)
        pieces.forEach((piece, p) => {
          const tipHere = !done && p === pieces.length - 1 && Math.hypot(piece[piece.length - 1].x - pts[pts.length - 1].x, piece[piece.length - 1].y - pts[pts.length - 1].y) < 3
          drawStroke(ctx, piece, span.weight, false, tipHere)
        })
        if (!done) {
          const tip = pts[pts.length - 1]
          const onNode = current.nodes.some((node) => {
            const grown = shown.includes(node.id)
            const r = inspectLayout(node, current.width, window.innerHeight, grown).disc / 2
            return Math.hypot(node.x - tip.x, node.y - tip.y) < r + 12
          })
          if (!onNode) {
            tips.push({ ...tip, weight: span.weight })
            if (tip.y >= head.y) head = tip
          }
        }
      })

      drawPair(ctx, current.start.a, current.start.b, 4.2)

      if (holdTo == null) {
        ;(current.forks || []).forEach((fork) => {
          if (fork.y > lead + 20 && !reducedThread()) return
          if (
            current.nodes.some((node) => {
              const grown = shown.includes(node.id)
              const r = inspectLayout(node, current.width, window.innerHeight, grown).disc / 2
              return Math.hypot(node.x - fork.x, node.y - fork.y) < r + 16
            })
          ) {
            return
          }
          drawDot(ctx, fork, 3.4)
        })
      }

      tips.forEach((tip) => drawHead(ctx, tip, tip.weight))

      if (peekJourney()) return
      const key = shown.join('|')
      if (key !== currentRef.current.join('|')) {
        currentRef.current = shown
        setOpen(shown)
      }
    }

    paint()
    gsap.ticker.add(paint)
    return () => {
      gsap.ticker.remove(paint)
    }
  }, [graph])

  useEffect(() => {
    const host = track.current
    const svg = mobileThread.current
    if (!host || !svg || !graph?.nodes.length) return

    const media = window.matchMedia(THREAD_ENHANCED_MEDIA)
    let frame = 0

    const draw = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        if (media.matches) return

        const hostRect = host.getBoundingClientRect()
        const positions = new Map<string, { x: number; y: number }>()
        const elements = new Map<string, HTMLElement>()
        const discs = new Map<string, DOMRect>()
        host.querySelectorAll<HTMLElement>('.thread-node[data-thread-id]').forEach((element) => {
          const id = element.dataset.threadId
          const disc = element.querySelector<HTMLElement>('.thread-disc')
          if (!id || !disc) return
          elements.set(id, element)
          const rect = disc.getBoundingClientRect()
          discs.set(id, rect)
          positions.set(id, {
            x: rect.left - hostRect.left + rect.width / 2,
            y: rect.top - hostRect.top + rect.height / 2,
          })
        })

        const width = Math.max(1, host.clientWidth)
        const height = Math.max(1, host.clientHeight)
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        const mask = svg.querySelector<SVGMaskElement>('[data-thread-mobile-mask]')
        const maskBase = svg.querySelector<SVGRectElement>('[data-thread-mask-base]')
        if (mask && maskBase) {
          mask.setAttribute('width', String(width))
          mask.setAttribute('height', String(height))
          maskBase.setAttribute('width', String(width))
          maskBase.setAttribute('height', String(height))
        }
        svg.querySelectorAll<SVGRectElement>('[data-thread-mask-cut]').forEach((cut) => {
          const element = elements.get(cut.dataset.node || '')
          const region = cut.dataset.region === 'heading' ? '.thread-heading' : '.thread-inspect'
          const target = element?.querySelector<HTMLElement>(region)
          if (!target) {
            cut.setAttribute('width', '0')
            cut.setAttribute('height', '0')
            return
          }
          const rect = target.getBoundingClientRect()
          if (rect.width <= 1 || rect.height <= 1) {
            cut.setAttribute('width', '0')
            cut.setAttribute('height', '0')
            return
          }
          const pad = cut.dataset.region === 'heading' ? 4 : 2
          cut.setAttribute('x', (rect.left - hostRect.left - pad).toFixed(1))
          cut.setAttribute('y', (rect.top - hostRect.top - pad).toFixed(1))
          cut.setAttribute('width', Math.max(0, rect.width + pad * 2).toFixed(1))
          cut.setAttribute('height', Math.max(0, rect.height + pad * 2).toFixed(1))
        })

        svg.querySelectorAll<SVGPathElement>('[data-thread-connector]').forEach((path) => {
          const fromId = path.dataset.from || ''
          const toId = path.dataset.to || ''
          const from = positions.get(fromId)
          const to = positions.get(toId)
          if (!from || !to) {
            path.setAttribute('d', '')
            return
          }

          const fromDisc = discs.get(fromId)
          const toDisc = discs.get(toId)
          const start = {
            x: from.x,
            y: (fromDisc?.bottom ?? from.y + hostRect.top) - hostRect.top,
          }
          const end = {
            x: to.x,
            y: (toDisc?.top ?? to.y + hostRect.top) - hostRect.top,
          }
          const bend = Math.max(28, Math.min(128, (end.y - start.y) * 0.52))
          path.setAttribute(
            'd',
            `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${start.x.toFixed(1)} ${(start.y + bend).toFixed(1)}, ${end.x.toFixed(1)} ${(end.y - bend).toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
          )
        })

        const first = positions.get(graph.nodes[0].id)
        const last = positions.get(graph.nodes[graph.nodes.length - 1].id)
        const tail = svg.querySelector<SVGPathElement>('[data-thread-tail]')
        if (tail && first && last) {
          const topBend = Math.max(18, first.y * 0.48)
          const bottomBend = Math.max(24, (height - last.y) * 0.48)
          tail.setAttribute(
            'd',
            `M ${first.x.toFixed(1)} 8 C ${first.x.toFixed(1)} ${topBend.toFixed(1)}, ${first.x.toFixed(1)} ${(first.y - topBend * 0.35).toFixed(1)}, ${first.x.toFixed(1)} ${first.y.toFixed(1)} M ${last.x.toFixed(1)} ${last.y.toFixed(1)} C ${last.x.toFixed(1)} ${(last.y + bottomBend).toFixed(1)}, ${last.x.toFixed(1)} ${(height - bottomBend * 0.35).toFixed(1)}, ${last.x.toFixed(1)} ${height.toFixed(1)}`,
          )
          svg.querySelectorAll<SVGCircleElement>('[data-thread-origin-dot]').forEach((dot, index) => {
            dot.setAttribute('cx', (first.x + (index === 0 ? -4.5 : 4.5)).toFixed(1))
            dot.setAttribute('cy', index === 0 ? '5.5' : '8.5')
          })
        }
      })
    }

    const observer = new ResizeObserver(draw)
    observer.observe(host)
    host.querySelectorAll<HTMLElement>('.thread-node').forEach((node) => observer.observe(node))
    media.addEventListener('change', draw)
    draw()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      media.removeEventListener('change', draw)
    }
  }, [graph])

  useEffect(() => {
    registerThread({
      landPoint: (id) => {
        const host = track.current
        const current = graphRef.current
        if (!host || !current) return null
        const item = current.nodes.find((node) => node.id === id) || current.nodes[0]
        if (!item) return null
        return viewportPoint(host, item.x, item.y)
      },
      travel: async (id, href) => {
        const host = track.current
        const current = graphRef.current
        const go = href
        if (!go) return null
        const item =
          current?.nodes.find((node) => node.id === id) ||
          current?.nodes.find((node) => currentRef.current.includes(node.id)) ||
          current?.nodes[0]
        const fromPoint =
          item && host
            ? viewportPoint(host, item.x, item.y)
            : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.42 }
        if (reducedThreadTravel()) {
          router.push(go)
          return fromPoint
        }
        router.prefetch(go)
        const from = gateFromPath(window.location.pathname)
        const to = gateFromHref(go)
        const heading =
          item && current
            ? headingFromScene(
                current,
                { x: item.x, y: item.y },
                item.id,
                fromPoint,
                window.innerWidth,
                window.innerHeight,
              )
            : headingFor(from, to)
        const journey = beginJourney({
          from,
          to,
          via: item?.id || id,
          fromPoint,
          heading,
          href: go,
        })
        const api = threadNav.bridge()
        if (api) await api.depart(journey, () => router.push(go))
        else router.push(go)
        return fromPoint
      },
    })
    return () => registerThread(null)
  }, [router])

  const onNode = async (item: PlacedNode) => {
    if (item.href) {
      await threadNav.travel(item.id, item.href)
      return
    }
    currentRef.current = [item.id]
    setOpen([item.id])
  }

  return (
    <div data-thread-context={context}>
      {filters}
      <div
        ref={track}
        className="thread-track relative w-full"
        style={
          graph
            ? graph.nodes.length
              ? { aspectRatio: `${graph.width} / ${graph.height}` }
              : { minHeight: 0 }
            : { minHeight: '120svh' }
        }
      >
        {graph?.nodes.length === 0 ? (
          empty
        ) : (
          <>
            <svg
              ref={mobileThread}
              className="thread-mobile-thread"
              aria-hidden="true"
              focusable="false"
              data-mobile-thread-connectors
            >
              <defs>
                <mask id={mobileMaskId} maskUnits="userSpaceOnUse" data-thread-mobile-mask>
                  <rect x="0" y="0" fill="white" data-thread-mask-base />
                  {graph?.nodes.flatMap((item) =>
                    (['heading', 'inspect'] as const).map((region) => (
                      <rect
                        key={`${item.id}-${region}`}
                        rx="6"
                        fill="black"
                        data-thread-mask-cut
                        data-node={item.id}
                        data-region={region}
                      />
                    )),
                  )}
                </mask>
              </defs>
              <g mask={`url(#${mobileMaskId})`}>
                <path className="thread-mobile-tail" data-thread-tail />
                {graph?.nodes.slice(1).map((item, index) => (
                  <path
                    key={`${graph.nodes[index].id}-${item.id}`}
                    className="thread-mobile-connector"
                    data-thread-connector
                    data-from={graph.nodes[index].id}
                    data-to={item.id}
                  />
                ))}
              </g>
              <circle className="thread-mobile-origin" r="2.8" data-thread-origin-dot />
              <circle className="thread-mobile-origin" r="2.8" data-thread-origin-dot />
            </svg>
            <canvas ref={canvas} className="pointer-events-none absolute left-0 top-0" />
            {graph?.nodes.map((item, index) => (
              <ThreadNode
                key={item.id}
                item={item}
                width={view.width}
                height={view.height}
                grown={open.includes(item.id)}
                side={index % 2 === 0 ? 'left' : 'right'}
                onEnter={() => void onNode(item)}
              />
            ))}
          </>
        )}
      </div>
      {after}
    </div>
  )
}
