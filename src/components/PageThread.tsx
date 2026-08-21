'use client'

import { useCallback, type ReactNode } from 'react'

import type { Locale } from '@/i18n/config'
import { contactGraph, labGraph } from '@/thread/recipes'

import { ThreadCanvas } from './ThreadCanvas'

export function LabThread({
  locale,
  items,
}: {
  locale: Locale
  items: { slug: string; title: string; year?: string | null; url?: string | null; lede?: string }[]
}) {
  const build = useCallback(() => labGraph(locale, items), [locale, items])
  return <ThreadCanvas build={build} />
}

export function ContactThread({
  locale,
  title,
  after,
}: {
  locale: Locale
  title: string
  after?: ReactNode
}) {
  const build = useCallback(() => contactGraph(locale, title), [locale, title])
  return <ThreadCanvas build={build} after={after} />
}
