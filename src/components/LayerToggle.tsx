'use client'

import { useEffect, useState } from 'react'

import { useCondition } from '@/condition/ConditionProvider'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

export function LayerToggle({
  locale,
  experience,
  system,
}: {
  locale: Locale
  experience: React.ReactNode
  system: React.ReactNode
}) {
  const { stillness, reducedMotion } = useCondition()
  const [layer, setLayer] = useState<'experience' | 'system'>('experience')
  const labels = t(locale)

  useEffect(() => {
    if (reducedMotion) return
    if (stillness) setLayer('system')
  }, [stillness, reducedMotion])

  return (
    <div>
      <div className="mb-8 flex items-center gap-6">
        <button
          type="button"
          className={`type-meta ${layer === 'experience' ? 'text-ink' : 'text-ink/40'}`}
          onClick={() => setLayer('experience')}
        >
          {labels.experience}
        </button>
        <span className="h-px w-10 bg-ink/20" aria-hidden />
        <button
          type="button"
          className={`type-meta ${layer === 'system' ? 'text-ink' : 'text-ink/40'}`}
          onClick={() => setLayer('system')}
        >
          {labels.system}
        </button>
      </div>
      <div className={layer === 'experience' ? 'block' : 'hidden'}>{experience}</div>
      <div className={layer === 'system' ? 'block' : 'hidden'}>{system}</div>
    </div>
  )
}
