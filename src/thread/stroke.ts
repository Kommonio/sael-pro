import { add, dist, mul, norm, perp, type Vec } from './math'
import type { Weight } from './path'

export type Ribbon = {
  left: Vec[]
  right: Vec[]
}

export function baseWidth(weight: Weight) {
  if (weight === 'spine') return 7.2
  if (weight === 'branch') return 3.4
  return 1.35
}

export function widthAt(t: number, weight: Weight, bend: number) {
  const taper = 0.72 + 0.28 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)))
  const swell = 1 + Math.min(0.55, bend * 14)
  return baseWidth(weight) * taper * swell
}

export function ribbonFrom(points: Vec[], weight: Weight, taperTip = false): Ribbon {
  const left: Vec[] = []
  const right: Vec[] = []
  const n = points.length
  if (n < 2) return { left: points, right: points }

  let total = 0
  const segs = [0]
  for (let i = 1; i < n; i += 1) {
    total += dist(points[i - 1], points[i])
    segs.push(total)
  }

  for (let i = 0; i < n; i += 1) {
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(n - 1, i + 1)]
    const tan = norm({ x: next.x - prev.x, y: next.y - prev.y })
    const normal = perp(tan)
    const t = total ? segs[i] / total : 0
    const fromEnd = total - segs[i]
    const tip = taperTip && fromEnd < 28 ? Math.max(0.08, fromEnd / 28) : 1
    const bend = i > 0 && i < n - 1 ? 1 - Math.abs(tan.x * (points[i].x - prev.x) + tan.y * (points[i].y - prev.y)) / (dist(points[i], prev) || 1) : 0
    const w = widthAt(t, weight, bend) * 0.5 * tip
    left.push(add(points[i], mul(normal, w)))
    right.push(add(points[i], mul(normal, -w)))
  }
  return { left, right }
}

export function sliceByLead(points: Vec[], lead: number) {
  if (points.length < 2) return points
  if (points[0].y > lead + 12) return []

  let turnsBack = false
  for (let i = 1; i < points.length; i += 1) {
    if (points[i].y < points[i - 1].y - 6) {
      turnsBack = true
      break
    }
  }
  if (turnsBack) {
    let minY = points[0].y
    let maxY = points[0].y
    for (const point of points) {
      if (point.y < minY) minY = point.y
      if (point.y > maxY) maxY = point.y
    }
    if (lead + 12 < minY) return []
    if (lead >= maxY) return points
    return slicePolyline(points, 0, Math.max(0.001, (lead - minY) / (maxY - minY || 1)))
  }

  const out: Vec[] = [points[0]]
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]
    const b = points[i]
    if (b.y <= lead) {
      out.push(b)
      continue
    }
    const dy = b.y - a.y
    if (a.y <= lead && dy > 0.6) {
      const t = (lead - a.y) / dy
      out.push({ x: a.x + (b.x - a.x) * t, y: lead })
    }
    break
  }
  return out
}

export function slicePolyline(points: Vec[], t0: number, t1: number) {
  if (points.length < 2) return points
  const out: Vec[] = []
  let total = 0
  const segs: number[] = [0]
  for (let i = 1; i < points.length; i += 1) {
    total += dist(points[i - 1], points[i])
    segs.push(total)
  }
  const a = total * Math.max(0, t0)
  const b = total * Math.min(1, t1)
  for (let i = 1; i < points.length; i += 1) {
    const s0 = segs[i - 1]
    const s1 = segs[i]
    if (s1 < a || s0 > b) continue
    const u0 = s1 === s0 ? 0 : (Math.max(a, s0) - s0) / (s1 - s0)
    const u1 = s1 === s0 ? 1 : (Math.min(b, s1) - s0) / (s1 - s0)
    if (out.length === 0) {
      out.push({
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * u0,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * u0,
      })
    }
    out.push({
      x: points[i - 1].x + (points[i].x - points[i - 1].x) * u1,
      y: points[i - 1].y + (points[i].y - points[i - 1].y) * u1,
    })
  }
  return out.length ? out : [points[0]]
}
