export type Vec = { x: number; y: number }

export const v = (x: number, y: number): Vec => ({ x, y })

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function mul(a: Vec, s: number): Vec {
  return { x: a.x * s, y: a.y * s }
}

export function len(a: Vec) {
  return Math.hypot(a.x, a.y)
}

export function dist(a: Vec, b: Vec) {
  return len(sub(a, b))
}

export function norm(a: Vec): Vec {
  const l = len(a) || 1
  return { x: a.x / l, y: a.y / l }
}

export function lerp(a: Vec, b: Vec, t: number): Vec {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export function perp(a: Vec): Vec {
  return { x: -a.y, y: a.x }
}

export function cubic(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

export function cubicDeriv(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const u = 1 - t
  return {
    x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
  }
}

export function sampleCubic(p0: Vec, p1: Vec, p2: Vec, p3: Vec, steps = 24) {
  const pts: Vec[] = []
  for (let i = 0; i <= steps; i += 1) pts.push(cubic(p0, p1, p2, p3, i / steps))
  return pts
}

export function autoHandles(from: Vec, to: Vec, sway = 0.32, flip = 1) {
  const d = sub(to, from)
  const n = mul(norm(perp(d)), len(d) * sway * flip)
  return {
    c1: add(lerp(from, to, 0.28), n),
    c2: add(lerp(from, to, 0.72), mul(n, -0.55)),
  }
}

export function polylineLength(pts: Vec[]) {
  let sum = 0
  for (let i = 1; i < pts.length; i += 1) sum += dist(pts[i - 1], pts[i])
  return sum
}

export function pointAtLength(pts: Vec[], at: number) {
  if (!pts.length) return v(0, 0)
  if (at <= 0) return pts[0]
  let acc = 0
  for (let i = 1; i < pts.length; i += 1) {
    const seg = dist(pts[i - 1], pts[i])
    if (acc + seg >= at) {
      const t = seg ? (at - acc) / seg : 0
      return lerp(pts[i - 1], pts[i], t)
    }
    acc += seg
  }
  return pts[pts.length - 1]
}

export function tangentAtLength(pts: Vec[], at: number): Vec {
  if (pts.length < 2) return v(0, 1)
  let acc = 0
  for (let i = 1; i < pts.length; i += 1) {
    const seg = dist(pts[i - 1], pts[i])
    if (acc + seg >= at) return norm(sub(pts[i], pts[i - 1]))
    acc += seg
  }
  return norm(sub(pts[pts.length - 1], pts[pts.length - 2]))
}
