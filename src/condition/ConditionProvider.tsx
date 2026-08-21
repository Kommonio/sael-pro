'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  ATTENDED_KEY,
  REMEMBER_KEY,
  SESSION_KEY,
  type Authorship,
  type ClimateHint,
  type ConditionState,
  type TopologyNode,
} from './types'

type AttendInput = {
  slug: string
  title: string
  authorship: Authorship
  climateHint: ClimateHint
  dwellMs?: number
}

type ConditionContextValue = ConditionState & {
  attend: (input: AttendInput) => void
  remember: (slug: string) => void
  setStillness: (value: boolean) => void
  setClimateNow: (hint: ClimateHint) => void
}

const ConditionContext = createContext<ConditionContextValue | null>(null)

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function sessionId() {
  if (typeof window === 'undefined') return ''
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.sessionStorage.setItem(SESSION_KEY, id)
  return id
}

function dominantClimate(attended: Record<string, TopologyNode>, remembered: string[]): ClimateHint {
  const weights: Record<ClimateHint, number> = {
    earth: 0.2,
    sap: 0,
    clay: 0,
    moss: 0,
    acid: 0,
  }
  for (const node of Object.values(attended)) {
    const extra = remembered.includes(node.slug) ? 1.6 : 1
    weights[node.climateHint] += (node.dwellMs / 4000) * extra
  }
  return (Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] as ClimateHint) || 'earth'
}

export function ConditionProvider({ children }: { children: ReactNode }) {
  const [attended, setAttended] = useState<Record<string, TopologyNode>>({})
  const [remembered, setRemembered] = useState<string[]>([])
  const [stillness, setStillness] = useState(false)
  const [occupancy, setOccupancy] = useState(1)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [climateNow, setClimateNowState] = useState<ClimateHint | null>(null)
  const idleTimer = useRef<number | null>(null)

  useEffect(() => {
    setAttended(readJson(ATTENDED_KEY, {}))
    setRemembered(readJson(REMEMBER_KEY, []))
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const setClimateNow = useCallback((hint: ClimateHint) => {
    setClimateNowState(hint)
    document.documentElement.dataset.climate = hint
  }, [])

  useEffect(() => {
    document.documentElement.dataset.climate = climateNow || dominantClimate(attended, remembered)
  }, [attended, remembered, climateNow])

  useEffect(() => {
    document.documentElement.dataset.still = stillness ? '1' : '0'
  }, [stillness])

  useEffect(() => {
    const markActive = () => {
      setStillness(false)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => setStillness(true), 2800)
    }
    markActive()
    window.addEventListener('scroll', markActive, { passive: true })
    window.addEventListener('pointerdown', markActive)
    window.addEventListener('keydown', markActive)
    return () => {
      window.removeEventListener('scroll', markActive)
      window.removeEventListener('pointerdown', markActive)
      window.removeEventListener('keydown', markActive)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [])

  useEffect(() => {
    const id = sessionId()
    if (!id) return
    const ping = async () => {
      try {
        const res = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId: id }),
        })
        if (res.ok) {
          const data = (await res.json()) as { count?: number }
          if (typeof data.count === 'number') setOccupancy(data.count)
        }
      } catch {
        /* occupancy is optional */
      }
    }
    void ping()
    const timer = window.setInterval(ping, 25000)
    return () => window.clearInterval(timer)
  }, [])

  const attend = useCallback((input: AttendInput) => {
    setAttended((prev) => {
      const existing = prev[input.slug]
      const next: TopologyNode = {
        slug: input.slug,
        title: input.title,
        authorship: input.authorship,
        climateHint: input.climateHint,
        dwellMs: (existing?.dwellMs || 0) + (input.dwellMs || 1200),
        remembered: remembered.includes(input.slug),
      }
      const merged = { ...prev, [input.slug]: next }
      window.localStorage.setItem(ATTENDED_KEY, JSON.stringify(merged))
      return merged
    })
  }, [remembered])

  const remember = useCallback((slug: string) => {
    setRemembered((prev) => {
      const next = prev.includes(slug) ? prev : [...prev, slug]
      window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo<ConditionContextValue>(() => {
    const climate = dominantClimate(attended, remembered)
    const path = Array.from(new Set(Object.values(attended).map((node) => node.authorship)))
    return {
      climate,
      stillness,
      reducedMotion,
      occupancy,
      attended,
      remembered,
      path,
      attend,
      remember,
      setStillness,
      setClimateNow,
    }
  }, [attended, remembered, stillness, reducedMotion, occupancy, attend, remember, setClimateNow])

  return <ConditionContext.Provider value={value}>{children}</ConditionContext.Provider>
}

export function useCondition() {
  const ctx = useContext(ConditionContext)
  if (!ctx) throw new Error('useCondition must be used within ConditionProvider')
  return ctx
}
