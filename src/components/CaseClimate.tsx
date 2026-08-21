'use client'

import { useEffect } from 'react'

import { useCondition } from '@/condition/ConditionProvider'
import type { ClimateHint } from '@/condition/types'

export function CaseClimate({ hint, night }: { hint: ClimateHint; night?: boolean }) {
  const { setClimateNow } = useCondition()

  useEffect(() => {
    setClimateNow(hint)
    document.documentElement.dataset.header = night ? 'over-night' : 'paper'
    return () => {
      document.documentElement.dataset.header = 'paper'
    }
  }, [hint, night, setClimateNow])

  return null
}
