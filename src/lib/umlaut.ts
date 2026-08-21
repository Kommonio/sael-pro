type Point = { x: number; y: number }

type UmlautAPI = {
  through: (from?: Point | 'header') => Promise<void>
  flip: () => Promise<void>
  cross: () => Promise<void>
  land: (target?: DOMRect | 'header') => Promise<void>
  kill: () => void
}

let api: UmlautAPI | null = null
let running: Promise<void> | null = null

export function registerUmlaut(next: UmlautAPI | null) {
  api = next
}

function noop() {
  return Promise.resolve()
}

function run(verb: () => Promise<void>) {
  api?.kill()
  const next = verb()
  running = next
  return next.finally(() => {
    if (running === next) running = null
  })
}

export const umlaut = {
  through: (from?: Point | 'header') => (api ? run(() => api!.through(from)) : noop()),
  flip: () => (api ? run(() => api!.flip()) : noop()),
  cross: () => (api ? run(() => api!.cross()) : noop()),
  land: (target?: DOMRect | 'header') => (api ? run(() => api!.land(target)) : noop()),
  kill: () => api?.kill(),
}

export function reducedUmlaut() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function markPair() {
  const a = document.querySelector('.logo-dot-a')
  const b = document.querySelector('.logo-dot-b')
  if (a && b) {
    const ra = a.getBoundingClientRect()
    const rb = b.getBoundingClientRect()
    return {
      a: { x: ra.left + ra.width / 2, y: ra.top + ra.height / 2 },
      b: { x: rb.left + rb.width / 2, y: rb.top + rb.height / 2 },
    }
  }
  return {
    a: { x: 36, y: 28 },
    b: { x: 58, y: 32 },
  }
}
