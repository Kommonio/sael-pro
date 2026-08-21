import { add, dist, lerp, mul, norm, perp, polylineLength, sub, type Vec, v } from './math'
import { continueCurve, joinPolylines, loopPoints, branchCurve } from './path'
import { markApproaches, type CompiledGraph } from './graph'

export type Gate = 'home' | 'work' | 'practice' | 'lab' | 'about' | 'contact' | 'case'

export type Journey = {
  from: Gate
  to: Gate
  via: string
  fromPoint: Vec
  heading: Vec
  href: string
}

let current: Journey | null = null
let arrivalTaken = false
let holdArrival = false
let arrivalStamp: { nodeId: string; heading: Vec; to: Gate; href: string } | null = null

export function peekJourney() {
  return current
}

export function peekArrivalHold() {
  return holdArrival
}

export function releaseArrivalHold() {
  holdArrival = false
}

export function takeJourneyArrival() {
  if (!current || arrivalTaken) return null
  arrivalTaken = true
  return current
}

export function peekArrivalStamp() {
  return arrivalStamp
}

export function beginJourney(next: Journey) {
  current = next
  arrivalTaken = false
  holdArrival = true
  arrivalStamp = { nodeId: next.via, heading: next.heading, to: next.to, href: next.href }
  setThreadMoving(true)
  if (next.to === 'home') setThreadPlace('home')
  return next
}

export function endJourney() {
  const to = current?.to
  current = null
  setThreadMoving(false)
  if (to) setThreadPlace(to === 'home' ? 'home' : 'inner')
}

export function setThreadPlace(place: 'home' | 'inner') {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.threadPlace = place
}

export function setThreadMoving(moving: boolean) {
  if (typeof document === 'undefined') return
  if (moving) document.documentElement.dataset.threadMoving = 'true'
  else delete document.documentElement.dataset.threadMoving
}

export function gateFromPath(path: string): Gate {
  if (/\/work\/[^/]+/.test(path)) return 'case'
  if (path.includes('/work')) return 'work'
  if (path.includes('/practice')) return 'practice'
  if (path.includes('/lab')) return 'lab'
  if (path.includes('/about')) return 'about'
  if (path.includes('/contact')) return 'contact'
  return 'home'
}

export function gateFromHref(href: string): Gate {
  return gateFromPath(href)
}

const OUT: Record<Gate, Vec> = {
  home: { x: -0.12, y: -1 },
  work: { x: 0.1, y: 1 },
  practice: { x: -0.78, y: 0.62 },
  lab: { x: 0.78, y: 0.62 },
  about: { x: 0.04, y: 1 },
  contact: { x: -0.32, y: 0.95 },
  case: { x: 0.18, y: 1 },
}

export function headingFor(from: Gate, to: Gate): Vec {
  if (to === 'home') {
    const out = OUT[from] || OUT.work
    return norm({ x: -out.x * 0.6 - 0.18, y: -Math.abs(out.y) - 0.12 })
  }
  return norm(OUT[to] || OUT.work)
}

function clutterInCone(graph: CompiledGraph, origin: Vec, originId: string | undefined, dir: Vec, depth: number) {
  const axis = norm(dir)
  const side = perp(axis)
  let score = 0
  for (const node of graph.nodes) {
    if (node.id === originId) continue
    const rel = sub({ x: node.x, y: node.y }, origin)
    const along = rel.x * axis.x + rel.y * axis.y
    const across = Math.abs(rel.x * side.x + rel.y * side.y)
    const width = 88 + along * 0.38
    if (along > 28 && along < depth && across < width) {
      score += 2.4 / (0.35 + along / depth)
    }
  }
  for (const span of graph.spans) {
    const step = Math.max(1, Math.floor(span.points.length / 10))
    for (let i = 0; i < span.points.length; i += step) {
      const rel = sub(span.points[i], origin)
      if (dist(span.points[i], origin) < 36) continue
      const along = rel.x * axis.x + rel.y * axis.y
      const across = Math.abs(rel.x * side.x + rel.y * side.y)
      if (along > 24 && along < depth && across < 64 + along * 0.22) {
        score += 0.12
      }
    }
  }
  return score
}

export function headingFromScene(
  graph: CompiledGraph,
  origin: Vec,
  originId: string | undefined,
  view: Vec,
  viewW: number,
  viewH: number,
) {
  const depth = Math.max(graph.width, graph.height) * 0.62
  const choices = [
    { id: 'right' as const, dir: v(1, 0.1), edge: viewW - view.x, horizontal: true },
    { id: 'left' as const, dir: v(-1, 0.1), edge: view.x, horizontal: true },
    { id: 'down' as const, dir: v(0.08, 1), edge: viewH - view.y, horizontal: false },
    { id: 'up' as const, dir: v(-0.08, -1), edge: view.y, horizontal: false },
  ]
  let best = choices[0]
  let bestScore = Infinity
  for (const choice of choices) {
    const clutter = clutterInCone(graph, origin, originId, choice.dir, depth)
    const trapped = choice.edge < 96 ? 6.5 : 0
    const runway = -Math.min(2.2, choice.edge / 420)
    const preferSide = choice.horizontal ? -1.15 : 0
    const score = clutter + trapped + runway + preferSide
    if (score < bestScore) {
      bestScore = score
      best = choice
    }
  }
  return norm(best.dir)
}

export function farPoint(origin: Vec, heading: Vec) {
  const span = Math.hypot(window.innerWidth, window.innerHeight) * 1.08
  return add(origin, mul(norm(heading), span))
}

function strokeTo(from: Vec, to: Vec, heading: Vec) {
  const h = norm(heading)
  if (Math.abs(h.x) >= Math.abs(h.y)) {
    return branchCurve(from, to, h, h.x >= 0 ? 0.45 : -0.45, 36)
  }
  return continueCurve(from, to, h, 36)
}

export function departPath(origin: Vec, heading: Vec, homecoming = false) {
  const dest = farPoint(origin, heading)
  const h = norm(heading)
  if (!homecoming) return strokeTo(origin, dest, h)
  const mid = lerp(origin, dest, 0.42)
  const loop = loopPoints(mid, sub(dest, origin), 72, Math.PI * 1.28)
  const into = continueCurve(origin, loop[0] || mid, heading, 20)
  const out = continueCurve(loop[loop.length - 1] || mid, dest, heading, 22)
  return joinPolylines(joinPolylines(into, loop), out)
}

export function arrivePath(land: Vec, heading: Vec) {
  const h = norm(heading)
  const start = farPoint(land, mul(h, -1))
  return strokeTo(start, land, h)
}

export function stitchPaths(leaving: Vec[], entering: Vec[], heading: Vec) {
  if (!leaving.length) return entering
  if (!entering.length) return leaving
  const from = leaving[leaving.length - 1]
  const to = entering[0]
  if (dist(from, to) < 12) return joinPolylines(leaving, entering)

  const h = norm(heading)
  const ht = window.innerHeight
  const m = 220
  const out = add(from, mul(h, m * 0.45))
  const top = Math.abs(h.y) >= Math.abs(h.x) && h.y < 0
  const yOut = top ? ht + m : -m
  const ring = [out, v(out.x, yOut), v(to.x, yOut), to]
  let pts = leaving
  let prev = from
  let dir = h
  for (const next of ring) {
    pts = joinPolylines(pts, continueCurve(prev, next, dir, 10))
    dir = sub(next, prev)
    prev = next
  }
  return joinPolylines(pts, entering)
}

export function landNodeId(graph: CompiledGraph, journey: Journey) {
  return (
    graph.nodes.find((node) => node.id === journey.via)?.id ||
    graph.nodes.find((node) => node.id === journey.to)?.id ||
    graph.nodes[0]?.id ||
    null
  )
}

export function incomingSpanIndex(graph: CompiledGraph, nodeId: string) {
  const node = graph.nodes.find((item) => item.id === nodeId)
  if (!node || !graph.spans.length) return 0
  const land = { x: node.x, y: node.y }
  let best = 0
  let bestD = Infinity
  graph.spans.forEach((span, i) => {
    const end = span.points[span.points.length - 1]
    if (!end) return
    const d = dist(end, land)
    if (d < bestD - 0.4 || (Math.abs(d - bestD) < 0.4 && i < best)) {
      bestD = d
      best = i
    }
  })
  return best
}

export function stampArrival(
  graph: CompiledGraph,
  nodeId: string,
  land: Vec,
  heading: Vec,
  origin: Vec,
) {
  const node = graph.nodes.find((item) => item.id === nodeId)
  if (!node) return graph
  const mapped = arrivePath(land, heading).map((point) => ({
    x: point.x - origin.x,
    y: point.y - origin.y,
  }))
  const inset = 10
  let first = mapped.findIndex(
    (point) =>
      point.x >= inset &&
      point.y >= inset &&
      point.x <= graph.width - inset &&
      point.y <= graph.height - inset,
  )
  if (first < 0) first = mapped.findIndex((point) => point.x >= 0 && point.y >= 0)
  if (first < 0) first = 0
  const points = mapped.slice(first)
  if (points.length < 2) return graph
  points[points.length - 1] = { x: node.x, y: node.y }
  const start = points[0]
  const nudge = start.x < 28 ? 16 : start.y < 28 ? 10 : 0
  const index = incomingSpanIndex(graph, nodeId)
  return markApproaches({
    ...graph,
    start: {
      a: add(start, v(-11 + nudge, -7)),
      b: add(start, v(13 + nudge, -1)),
    },
    spans: graph.spans.map((span, i) =>
      i === index ? { ...span, points, length: polylineLength(points) } : span,
    ),
  })
}
