import type { Vec } from './math'
import type { Weight } from './path'
import { ribbonFrom, type Ribbon } from './stroke'

function fillRibbon(ctx: CanvasRenderingContext2D, ribbon: Ribbon, fill: string) {
  if (ribbon.left.length < 2) return
  ctx.beginPath()
  ctx.moveTo(ribbon.left[0].x, ribbon.left[0].y)
  for (let i = 1; i < ribbon.left.length; i += 1) ctx.lineTo(ribbon.left[i].x, ribbon.left[i].y)
  for (let i = ribbon.right.length - 1; i >= 0; i -= 1) ctx.lineTo(ribbon.right[i].x, ribbon.right[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

export function inkFor(weight: Weight, night = false) {
  if (night) return weight === 'hairline' ? 'rgba(241,232,212,0.35)' : 'rgba(241,232,212,0.88)'
  if (weight === 'spine') return '#1A1610'
  if (weight === 'branch') return '#3A3226'
  return 'rgba(26,22,16,0.38)'
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  points: Vec[],
  weight: Weight,
  night = false,
  taperTip = false,
) {
  if (points.length < 2) return
  fillRibbon(ctx, ribbonFrom(points, weight, taperTip), inkFor(weight, night))
}

export function drawDot(ctx: CanvasRenderingContext2D, p: Vec, r: number, fill = '#C9A227') {
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
}

export function drawRing(ctx: CanvasRenderingContext2D, p: Vec, r: number, stroke = '#C9A227') {
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.6
  ctx.stroke()
}

export function drawPair(ctx: CanvasRenderingContext2D, a: Vec, b: Vec, r = 4.2) {
  drawDot(ctx, a, r)
  drawDot(ctx, b, r)
}

export function drawHead(ctx: CanvasRenderingContext2D, tip: Vec, weight: Weight, night = false) {
  const w = weight === 'spine' ? 7.2 : weight === 'branch' ? 3.4 : 1.35
  const ink = inkFor(weight, night)
  const outer = Math.max(6.4, w * 1.05)
  ctx.beginPath()
  ctx.arc(tip.x, tip.y, w * 0.55, 0, Math.PI * 2)
  ctx.fillStyle = ink
  ctx.fill()
  ctx.beginPath()
  ctx.arc(tip.x, tip.y, outer + 2.4, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(201,162,39,0.28)'
  ctx.lineWidth = 2.2
  ctx.stroke()
  drawDot(ctx, tip, outer, '#C9A227')
  drawDot(ctx, tip, Math.max(1.6, outer * 0.26), night ? '#0e0c09' : '#F1E8D4')
}

export function resizeCanvas(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.max(1, Math.floor(cssW * dpr))
  canvas.height = Math.max(1, Math.floor(cssH * dpr))
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}
