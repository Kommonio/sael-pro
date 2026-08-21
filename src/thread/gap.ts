import { dist, lerp, type Vec } from './math'

export type InkMask =
  | { kind: 'disc'; x: number; y: number; r: number }
  | { kind: 'box'; x: number; y: number; w: number; h: number }

function insideMask(p: Vec, mask: InkMask) {
  if (mask.kind === 'disc') return dist(p, mask) <= mask.r
  return p.x >= mask.x && p.x <= mask.x + mask.w && p.y >= mask.y && p.y <= mask.y + mask.h
}

function insideAny(p: Vec, masks: InkMask[]) {
  return masks.some((mask) => insideMask(p, mask))
}

function discHits(a: Vec, b: Vec, mask: Extract<InkMask, { kind: 'disc' }>) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const fx = a.x - mask.x
  const fy = a.y - mask.y
  const A = dx * dx + dy * dy
  if (A < 1e-8) return []
  const B = 2 * (fx * dx + fy * dy)
  const C = fx * fx + fy * fy - mask.r * mask.r
  const disc = B * B - 4 * A * C
  if (disc < 0) return []
  const s = Math.sqrt(disc)
  return [(-B - s) / (2 * A), (-B + s) / (2 * A)].filter((t) => t > 0.001 && t < 0.999)
}

function boxHits(a: Vec, b: Vec, mask: Extract<InkMask, { kind: 'box' }>) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const ts: number[] = []
  const add = (t: number, x: number, y: number) => {
    if (t <= 0.001 || t >= 0.999) return
    if (x >= mask.x - 0.2 && x <= mask.x + mask.w + 0.2 && y >= mask.y - 0.2 && y <= mask.y + mask.h + 0.2) {
      ts.push(t)
    }
  }
  if (Math.abs(dx) > 1e-6) {
    add((mask.x - a.x) / dx, mask.x, a.y + dy * ((mask.x - a.x) / dx))
    add((mask.x + mask.w - a.x) / dx, mask.x + mask.w, a.y + dy * ((mask.x + mask.w - a.x) / dx))
  }
  if (Math.abs(dy) > 1e-6) {
    add((mask.y - a.y) / dy, a.x + dx * ((mask.y - a.y) / dy), mask.y)
    add((mask.y + mask.h - a.y) / dy, a.x + dx * ((mask.y + mask.h - a.y) / dy), mask.y + mask.h)
  }
  return ts
}

function hits(a: Vec, b: Vec, mask: InkMask) {
  return mask.kind === 'disc' ? discHits(a, b, mask) : boxHits(a, b, mask)
}

/** Split a polyline where it passes under discs or type, so ink meets a node instead of scribbling through it. */
export function gapByMasks(points: Vec[], masks: InkMask[]): Vec[][] {
  if (points.length < 2) return []
  if (!masks.length) return [points]

  const cuts: { t: number; p: Vec }[] = []
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]
    const b = points[i]
    const ts = [...new Set(masks.flatMap((mask) => hits(a, b, mask)))].sort((x, y) => x - y)
    ts.forEach((t) => cuts.push({ t: i - 1 + t, p: lerp(a, b, t) }))
  }

  const keyed = points.map((p, i) => ({ t: i, p }))
  const seq = [...keyed, ...cuts].sort((a, b) => a.t - b.t)
  const pieces: Vec[][] = []
  let current: Vec[] = []

  const push = (p: Vec) => {
    const last = current[current.length - 1]
    if (last && dist(last, p) < 0.4) return
    current.push(p)
  }

  for (const item of seq) {
    const covered = insideAny(item.p, masks)
    if (covered) {
      if (current.length > 1) pieces.push(current)
      current = []
      continue
    }
    push(item.p)
  }
  if (current.length > 1) pieces.push(current)
  return pieces
}
