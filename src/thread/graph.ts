import { add, dist, polylineLength, type Vec, v } from './math'
import { branchCurve, continueCurve, curvePoints, loopPoints, type Clock, type Polyline, type Weight } from './path'

export type NodeKind = 'disc' | 'ring' | 'night'

export type ThreadNodeSpec = {
  id: string
  label: string
  meta?: string
  detail?: string
  enter?: string
  href?: string
  still?: string | null
  credit?: string
  weight?: Weight
  kind?: NodeKind
  loose?: boolean
}

export type PlacedNode = ThreadNodeSpec & {
  x: number
  y: number
  t: number
  weight: Weight
  kind: NodeKind
  inFrom?: Vec
  outTo?: Vec
}

export type CompiledSpan = Polyline & {
  length: number
  t0: number
  t1: number
}

export type CompiledGraph = {
  width: number
  height: number
  spans: CompiledSpan[]
  nodes: PlacedNode[]
  forks: Vec[]
  start: { a: Vec; b: Vec }
  end: Vec
  total: number
}

export class ThreadBuilder {
  private pen: Vec
  private last: Vec
  private flip = 1
  private currentWeight: Weight = 'spine'
  private currentClock: Clock = 'scroll'
  private spans: Polyline[] = []
  private nodes: PlacedNode[] = []
  private forks: Vec[] = []
  private pendingWait = false
  private peel: number | null = null
  private startPair: { a: Vec; b: Vec }

  constructor(private box = { width: 1000, height: 0 }) {
    this.pen = v(box.width * 0.12, 48)
    this.last = this.pen
    this.startPair = {
      a: add(this.pen, v(-10, -6)),
      b: add(this.pen, v(12, -2)),
    }
  }

  from(point: Vec | 'mark') {
    if (point !== 'mark') this.pen = point
    this.last = this.pen
    this.startPair = {
      a: add(this.pen, v(-11, -7)),
      b: add(this.pen, v(13, -1)),
    }
    return this
  }

  weight(w: Weight) {
    this.currentWeight = w
    return this
  }

  clock(c: Clock) {
    this.currentClock = c
    return this
  }

  curveTo(to: Vec, sway = 0.34) {
    const pts =
      this.peel != null
        ? branchCurve(this.pen, to, this.last, this.peel)
        : curvePoints(this.pen, to, sway, this.flip)
    this.peel = null
    this.flip *= -1
    this.push(pts)
    this.last = subDir(this.pen, to)
    this.pen = to
    return this
  }

  loop(r = 54, sweep = Math.PI * 1.35) {
    const incoming = this.last.x || this.last.y ? this.last : v(0, 1)
    const pts = loopPoints(this.pen, incoming, r, sweep)
    this.push(pts)
    if (pts.length) {
      this.last = subDir(pts[pts.length - 2] || this.pen, pts[pts.length - 1])
      this.pen = pts[pts.length - 1]
    }
    return this
  }

  node(spec: ThreadNodeSpec) {
    this.nodes.push({
      ...spec,
      x: this.pen.x,
      y: this.pen.y,
      t: 0,
      weight: spec.weight || this.currentWeight,
      kind: spec.kind || 'disc',
    })
    return this
  }

  wait() {
    this.pendingWait = true
    return this
  }

  split(build: (arm: (bias: number) => ThreadBuilder) => void) {
    const origin = { ...this.pen }
    const incoming = this.last.x || this.last.y ? this.last : v(0, 1)
    const launch = v(origin.x, origin.y + 188)
    this.push(continueCurve(origin, launch, incoming, 14))
    this.pen = launch
    this.last = v(0, 1)
    const arms: ThreadBuilder[] = []
    const fork = (bias: number) => {
      const child = new ThreadBuilder(this.box)
      child.pen = { ...launch }
      child.last = v(0, 1)
      child.currentWeight = 'branch'
      child.currentClock = this.currentClock
      child.peel = bias >= 0 ? 1 : -1
      child.flip = bias >= 0 ? 1 : -1
      arms.push(child)
      return child
    }
    build(fork)
    let maxY = launch.y
    const armSpans: Polyline[] = []
    for (const arm of arms) {
      const compiled = arm.compile()
      armSpans.push(
        ...compiled.spans.map((span) => ({
          points: span.points,
          weight: 'branch' as Weight,
          clock: span.clock,
          wait: false,
        })),
      )
      this.nodes.push(...compiled.nodes)
      this.forks.push(...compiled.forks)
      compiled.spans.forEach((span) => {
        span.points.forEach((p) => {
          maxY = Math.max(maxY, p.y)
        })
      })
      compiled.nodes.forEach((node) => {
        maxY = Math.max(maxY, node.y)
      })
    }
    const join = v(launch.x, maxY + 72)
    this.forks.push({ ...launch })
    const trunk = this.currentWeight
    this.currentWeight = 'spine'
    this.push(continueCurve(launch, join, v(0, 1)))
    this.currentWeight = trunk
    this.spans.push(...armSpans)
    this.pen = join
    this.last = v(0, 1)
    return this
  }

  compile(): CompiledGraph {
    let total = 0
    const spans: CompiledSpan[] = this.spans.map((span) => {
      const length = polylineLength(span.points)
      const next = { ...span, length, t0: total, t1: total + length }
      total += length
      return next
    })
    const nodes = this.nodes.map((node) => {
      const nearest = nearestT(spans, v(node.x, node.y), total)
      return { ...node, t: nearest }
    })
    const maxY = Math.max(
      this.pen.y,
      ...spans.flatMap((span) => span.points.map((p) => p.y)),
      ...nodes.map((n) => n.y),
      400,
    )
    return markApproaches({
      width: this.box.width,
      height: maxY + 160,
      spans,
      nodes,
      forks: this.forks.map((p) => ({ ...p })),
      start: this.startPair,
      end: this.pen,
      total: total || 1,
    })
  }

  private push(points: Vec[]) {
    if (points.length < 2) return
    this.spans.push({
      points,
      weight: this.currentWeight,
      clock: this.currentClock,
      wait: this.pendingWait,
    })
    this.pendingWait = false
  }
}

function subDir(a: Vec, b: Vec): Vec {
  return { x: b.x - a.x, y: b.y - a.y }
}

function nearestT(spans: CompiledSpan[], p: Vec, total: number) {
  let best = 0
  let bestD = Infinity
  let acc = 0
  for (const span of spans) {
    for (let i = 0; i < span.points.length; i += 1) {
      const d = dist(span.points[i], p)
      if (d < bestD) {
        bestD = d
        best = total ? (acc + (span.length * i) / Math.max(1, span.points.length - 1)) / total : 0
      }
    }
    acc += span.length
  }
  return best
}

export function thread(box?: { width?: number; height?: number }) {
  return new ThreadBuilder({ width: box?.width || 1000, height: box?.height || 0 })
}

export function scaleGraph(graph: CompiledGraph, width: number): CompiledGraph {
  const s = width / graph.width
  const map = (p: Vec) => v(p.x * s, p.y * s)
  return markApproaches({
    ...graph,
    width,
    height: graph.height * s,
    start: { a: map(graph.start.a), b: map(graph.start.b) },
    end: map(graph.end),
    forks: (graph.forks || []).map(map),
    spans: graph.spans.map((span) => ({
      ...span,
      points: span.points.map(map),
      length: span.length * s,
      t0: span.t0 * s,
      t1: span.t1 * s,
    })),
    nodes: graph.nodes.map((node) => ({ ...node, x: node.x * s, y: node.y * s })),
    total: graph.total * s,
  })
}

export function markApproaches(graph: CompiledGraph): CompiledGraph {
  const nodes = graph.nodes.map((node) => {
    const land = { x: node.x, y: node.y }
    let incoming: CompiledSpan | null = null
    let incomingD = Infinity
    let outgoing: CompiledSpan | null = null
    let outgoingD = Infinity
    for (const span of graph.spans) {
      const start = span.points[0]
      const end = span.points[span.points.length - 1]
      if (end) {
        const d = dist(end, land)
        if (d < incomingD) {
          incomingD = d
          incoming = span
        }
      }
      if (start) {
        const d = dist(start, land)
        if (d < 18 && d < outgoingD) {
          const endsHere = end ? dist(end, land) < 18 : false
          if (endsHere && span.points.length < 10) continue
          outgoingD = d
          outgoing = span
        }
      }
    }
    const prev = incoming?.points[Math.max(0, (incoming?.points.length || 1) - 8)] || v(node.x, node.y - 1)
    const next = outgoing?.points[Math.min(8, (outgoing?.points.length || 1) - 1)]
    return {
      ...node,
      inFrom: { x: node.x - prev.x, y: node.y - prev.y },
      outTo: next ? { x: next.x - node.x, y: next.y - node.y } : undefined,
    }
  })
  return { ...graph, nodes }
}
