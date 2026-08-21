import type { PlacedNode } from './graph'
import { norm, type Vec } from './math'

const BAND = 170

function bandMean(band: PlacedNode[]) {
  return band.reduce((sum, node) => sum + node.y, 0) / band.length
}

function clusterBands(nodes: PlacedNode[]) {
  const sorted = [...nodes].sort((a, b) => a.y - b.y || a.x - b.x)
  const bands: PlacedNode[][] = []
  for (const node of sorted) {
    const last = bands[bands.length - 1]
    if (last && node.y - last[0].y < BAND) last.push(node)
    else bands.push([node])
  }
  return bands
}

export function nodesShownByThread(
  nodes: PlacedNode[],
  lead: number,
  _head?: { x: number; y: number },
  atStart = false,
  previous: string[] = [],
) {
  if (!nodes.length) return []
  const first = nodes.reduce((a, b) => (a.y < b.y || (a.y === b.y && a.x < b.x) ? a : b))
  if (atStart) return [first.id]
  const bands = clusterBands(nodes)
  let target = bands[0]
  for (const band of bands) {
    if (bandMean(band) <= lead + 72) target = band
  }
  const held = previous.length ? bands.find((band) => band.some((node) => previous.includes(node.id))) : null
  if (held && held !== target) {
    const mid = (bandMean(held) + bandMean(target)) / 2
    const goingDown = bandMean(target) > bandMean(held)
    if (goingDown ? lead < mid + 48 : lead > mid - 48) {
      return held.map((node) => node.id)
    }
  }
  return target.map((node) => node.id)
}

export function nodeShownByThread(
  nodes: PlacedNode[],
  lead: number,
  head?: { x: number; y: number },
  atStart = false,
) {
  return nodesShownByThread(nodes, lead, head, atStart)[0] || null
}

export type CopySide = 'left' | 'right' | 'top' | 'bottom'

export type InspectLayout = {
  disc: number
  idle: number
  side: CopySide
  copyX: number
  copyY: number
  copyW: number
  copyH: number
  align: 'left' | 'right' | 'center'
  title: number
}

export function inspectLayout(
  item: PlacedNode,
  pageWidth: number,
  pageHeight: number,
  grown = true,
): InspectLayout {
  const inset = Math.max(20, Math.min(56, pageWidth * 0.04))
  const still = Boolean(item.still)
  const idle = Math.max(11, Math.min(15, pageWidth * 0.01))
  const min = still ? 120 : 100
  const ideal = Math.min(pageWidth * (still ? 0.26 : 0.2), pageHeight * 0.34, still ? 320 : 248)
  let disc = grown ? Math.max(min, ideal) : idle

  const edge = Math.min(item.x - inset, pageWidth - item.x - inset) * 2
  if (grown) disc = Math.max(min * 0.72, Math.min(disc, Math.max(edge, 88)))

  const radius = disc / 2
  const gap = Math.max(grown ? 16 : 28, pageWidth * (grown ? 0.014 : 0.02))
  const title = Math.min(grown ? 30 : 26, Math.max(18, pageWidth * 0.022))
  const copyH = grown ? (item.loose ? 320 : item.detail ? 208 : 96) : 56
  const wantW = item.loose
    ? Math.min(460, Math.max(200, pageWidth * 0.4))
    : Math.min(grown ? 300 : 220, Math.max(136, pageWidth * (grown ? 0.3 : 0.22)))

  const leftRoom = item.x - radius - gap - inset
  const rightRoom = pageWidth - item.x - radius - gap - inset
  const topRoom = item.y - radius - gap - inset
  const bottomRoom = pageHeight

  const fit = (room: number, horizontal: boolean) => {
    const w = Math.min(wantW, Math.max(0, room))
    if (horizontal) return w >= 128 ? w : 0
    return w >= 148 ? w : 0
  }

  const mid = pageWidth * 0.5
  const onLeft = item.x < mid - 28
  const onRight = item.x > mid + 28
  const dir = item.inFrom ? norm(item.inFrom) : null

  const options: { side: CopySide; room: number; width: number; score: number }[] = [
    { side: 'right', room: rightRoom, width: fit(rightRoom, true), score: rightRoom },
    { side: 'left', room: leftRoom, width: fit(leftRoom, true), score: leftRoom },
    { side: 'bottom', room: bottomRoom, width: fit(pageWidth - inset * 2, false), score: bottomRoom * 0.5 },
    { side: 'top', room: topRoom, width: fit(pageWidth - inset * 2, false), score: topRoom * 0.42 },
  ]

  const blocked = new Set<CopySide>()

  const occupy = (velocity: Vec, toward: boolean) => {
    const horizontal = Math.abs(velocity.x) >= Math.abs(velocity.y) * 0.72
    if (horizontal) {
      const east = velocity.x >= 0
      blocked.add(toward ? (east ? 'right' : 'left') : east ? 'left' : 'right')
    } else {
      const south = velocity.y >= 0
      blocked.add(toward ? (south ? 'bottom' : 'top') : south ? 'top' : 'bottom')
    }
  }
  if (dir) occupy(dir, false)
  if (item.outTo && (item.outTo.x || item.outTo.y)) occupy(norm(item.outTo), true)

  const rank = (option: { side: CopySide; width: number }) => {
    if (blocked.has(option.side) || option.width <= 0) return -1
    let n = option.side === 'left' || option.side === 'right' ? 3 : option.side === 'bottom' ? 2 : 1
    if (onLeft && option.side === 'right') n -= 0.4
    if (onRight && option.side === 'left') n -= 0.4
    return n
  }
  const pick = options.reduce((a, b) => {
    const ra = rank(a)
    const rb = rank(b)
    if (rb !== ra) return rb > ra ? b : a
    return b.score >= a.score ? b : a
  })
  const chosen = rank(pick) >= 0 ? pick : options.find((option) => option.side === 'bottom') || pick

  const side = chosen.side
  const copyW = Math.min(wantW, Math.max(120, chosen.width || wantW))
  let copyX = 0
  let copyY = 0
  let align: InspectLayout['align'] = 'left'

  if (side === 'right') {
    copyX = radius + gap
    copyY = -copyH * 0.22
    align = 'left'
  } else if (side === 'left') {
    copyX = -(radius + gap + copyW)
    copyY = -copyH * 0.22
    align = 'right'
  } else if (side === 'bottom') {
    copyX = -copyW / 2
    copyY = radius + gap
    align = 'center'
  } else {
    copyX = -copyW / 2
    copyY = -(radius + gap + copyH)
    align = 'center'
  }

  const pageLeft = item.x + copyX
  const pageRight = pageLeft + copyW
  if (pageLeft < inset) copyX += inset - pageLeft
  if (pageRight > pageWidth - inset) copyX -= pageRight - (pageWidth - inset)

  const pageTop = item.y + copyY
  if (pageTop < inset) copyY += inset - pageTop

  return { disc, idle, side, copyX, copyY, copyW, copyH, align, title }
}
