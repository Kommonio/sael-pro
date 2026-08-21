'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { useCondition } from '@/condition/ConditionProvider'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { gsap, registerMotion } from '@/lib/motion'
import { umlaut } from '@/lib/umlaut'

export function LayerToggle({
  locale,
  experience,
  system,
}: {
  locale: Locale
  experience: ReactNode
  system: ReactNode
}) {
  const { stillness, reducedMotion } = useCondition()
  const [layer, setLayer] = useState<'experience' | 'system'>('experience')
  const [manual, setManual] = useState(false)
  const systemRef = useRef<HTMLDivElement>(null)
  const labels = t(locale)

  useEffect(() => {
    if (reducedMotion) return
    if (stillness && !manual) {
      setLayer('system')
      void umlaut.cross()
    }
    if (!stillness) setManual(false)
  }, [stillness, reducedMotion, manual])

  useEffect(() => {
    registerMotion()
    if (!systemRef.current) return
    if (reducedMotion) {
      gsap.set(systemRef.current, { opacity: layer === 'system' ? 1 : 0, clipPath: 'inset(0)' })
      return
    }
    if (layer === 'system') {
      gsap.to(systemRef.current, { opacity: 1, clipPath: 'inset(0)', duration: 0.9, ease: 'power3.out' })
    } else {
      gsap.to(systemRef.current, { opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: 0.45, ease: 'power2.in' })
    }
  }, [layer, reducedMotion])

  const choose = (next: 'experience' | 'system') => {
    setManual(true)
    setLayer(next)
  }

  return (
    <div>
      <div className="sticky top-[calc(3.75rem+env(safe-area-inset-top))] z-20 mb-8 flex items-center gap-6 bg-paper/80 py-3 backdrop-blur-md">
        <button
          type="button"
          className={`min-h-11 type-meta ${layer === 'experience' ? 'text-ink' : 'text-ink/40'}`}
          onClick={() => choose('experience')}
        >
          {labels.experience}
        </button>
        <span className="h-px w-10 bg-ink/20" aria-hidden />
        <button
          type="button"
          className={`min-h-11 type-meta ${layer === 'system' ? 'text-ink' : 'text-ink/40'}`}
          onClick={() => choose('system')}
        >
          {labels.system}
        </button>
      </div>
      <div className="relative">
        <div className={layer === 'system' && reducedMotion ? 'invisible' : 'block'}>{experience}</div>
        <div
          ref={systemRef}
          className={reducedMotion ? (layer === 'system' ? 'mt-8' : 'hidden') : 'absolute inset-x-0 top-0'}
          style={reducedMotion ? undefined : { opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
        >
          {system}
        </div>
      </div>
    </div>
  )
}
