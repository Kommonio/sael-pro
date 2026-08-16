'use client'

import { useRef, type ReactNode } from 'react'

import { useCondition } from './ConditionProvider'

export function RememberHold({
  slug,
  children,
  className,
}: {
  slug: string
  children: ReactNode
  className?: string
}) {
  const { remember, remembered } = useCondition()
  const timer = useRef<number | null>(null)
  const marked = remembered.includes(slug)

  const start = () => {
    timer.current = window.setTimeout(() => remember(slug), 650)
  }
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current)
  }

  return (
    <div
      className={className}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      data-remembered={marked || undefined}
    >
      {children}
    </div>
  )
}
