import type { CompiledGraph } from './graph'

export function reducedThread() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function leadY(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return window.innerHeight * 0.64 - rect.top + 120
}

export function focusY(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return window.innerHeight * 0.4 - rect.top
}

export function trackAtStart(el: HTMLElement) {
  return el.getBoundingClientRect().top > -32
}

export function trackProgress(el: HTMLElement) {
  const height = el.offsetHeight || 1
  return Math.min(1, Math.max(0, leadY(el) / height))
}

export function spanDrawEnd(graph: CompiledGraph, spanIndex: number, scroll: number) {
  if (reducedThread()) return 1
  const span = graph.spans[spanIndex]
  if (!span || !span.points.length) return 1
  const ys = span.points.map((p) => p.y)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const y = scroll * (graph.height || 1)
  const ahead = span.clock === 'lead' ? 90 : 36
  if (y + ahead < minY) return 0
  if (y >= maxY) return 1
  if (maxY <= minY) return y >= minY ? 1 : 0
  return Math.min(1, Math.max(0, (y + ahead - minY) / (maxY - minY)))
}
