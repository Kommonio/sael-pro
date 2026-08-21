import { add, autoHandles, cubic, dist, lerp, mul, norm, perp, sampleCubic, sub, type Vec, v } from './math'

export type Weight = 'spine' | 'branch' | 'hairline'
export type Clock = 'scroll' | 'follow' | 'lead'

export type Polyline = {
  points: Vec[]
  weight: Weight
  clock: Clock
  wait: boolean
}

export function curvePoints(from: Vec, to: Vec, sway = 0.32, flip = 1, steps = 28) {
  const { c1, c2 } = autoHandles(from, to, sway, flip)
  return sampleCubic(from, c1, c2, to, steps)
}

export function continueCurve(from: Vec, to: Vec, incoming: Vec, steps = 28) {
  const d = dist(from, to) || 1
  const dir = norm(incoming.x || incoming.y ? incoming : sub(to, from))
  const c1 = add(from, mul(dir, d * 0.42))
  const c2 = add(lerp(from, to, 0.68), mul(perp(dir), d * 0.03))
  return sampleCubic(from, c1, c2, to, steps)
}

export function branchCurve(from: Vec, to: Vec, incoming: Vec, side: number, steps = 32) {
  const d = dist(from, to) || 1
  const dir = norm(incoming.x || incoming.y ? incoming : sub(to, from))
  const peel = norm(add(dir, mul(perp(dir), side * 1.2)))
  const c1 = add(from, mul(peel, d * 0.4))
  const c2 = add(lerp(from, to, 0.7), mul(perp(dir), side * d * 0.16))
  return sampleCubic(from, c1, c2, to, steps)
}

export function loopPoints(at: Vec, incoming: Vec, r: number, sweep: number, steps = 36) {
  const dir = norm(incoming)
  const n = perp(dir)
  const center = add(at, mul(n, r))
  const start = Math.atan2(at.y - center.y, at.x - center.x)
  const pts: Vec[] = []
  for (let i = 0; i <= steps; i += 1) {
    const a = start + (sweep * i) / steps
    pts.push(v(center.x + Math.cos(a) * r, center.y + Math.sin(a) * r))
  }
  return pts
}

export function joinPolylines(a: Vec[], b: Vec[]) {
  if (!a.length) return b
  if (!b.length) return a
  if (dist(a[a.length - 1], b[0]) < 0.5) return a.concat(b.slice(1))
  return a.concat(b)
}

export function cubicAt(from: Vec, to: Vec, t: number, sway = 0.32, flip = 1) {
  const { c1, c2 } = autoHandles(from, to, sway, flip)
  return cubic(from, c1, c2, to, t)
}
