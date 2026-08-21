import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useState } from 'react'

let registered = false

export function registerMotion() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip)
  registered = true
}

export function syncLenis(lenis: { on: (event: 'scroll', cb: () => void) => unknown; off?: (event: 'scroll', cb: () => void) => unknown; raf: (time: number) => void }) {
  registerMotion()
  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)
  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    lenis.off?.('scroll', onScroll)
    gsap.ticker.remove(tick)
  }
}

export function killMotion() {
  if (typeof window === 'undefined') return
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}

export function canPinRooms() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.innerHeight < 540) return false
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768) return false
  return window.innerWidth >= 1024
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return reduced
}

export { gsap, ScrollTrigger, Flip }
