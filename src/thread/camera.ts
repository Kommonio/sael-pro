import { reducedThread } from './clock'
import type { Vec } from './math'
import type { Journey } from './journey'

type PageAPI = {
  travel: (id: string, href?: string) => Promise<Vec | null>
  landPoint: (id?: string) => Vec | null
}

type BridgeAPI = {
  depart: (journey: Journey, go: () => void) => Promise<void>
  arrive: (land: Vec, journey: Journey) => Promise<void>
}

let page: PageAPI | null = null
let bridge: BridgeAPI | null = null

export function registerThread(next: PageAPI | null) {
  page = next
}

export function registerBridge(next: BridgeAPI | null) {
  bridge = next
}

export const threadNav = {
  travel: (id: string, href?: string) => page?.travel(id, href) ?? Promise.resolve(null),
  zoom: (id: string, href?: string) => page?.travel(id, href) ?? Promise.resolve(null),
  bridge: () => bridge,
}

export function playZoom(
  _canvas: HTMLCanvasElement,
  _from: Vec,
  onFill: () => void,
) {
  onFill()
  return Promise.resolve()
}

export { reducedThread }
