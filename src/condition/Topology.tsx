'use client'

import { useMemo, useState } from 'react'

import { useCondition } from './ConditionProvider'
import type { Locale } from '@/i18n/config'

const copy = {
  en: {
    open: 'Score',
    close: 'Close',
    empty: 'The score draws itself from what you actually stay with.',
    occupancy: 'in the room',
  },
  fr: {
    open: 'Partition',
    close: 'Fermer',
    empty: 'La partition se dessine à partir de ce à quoi vous restez vraiment.',
    occupancy: 'dans la pièce',
  },
}

export function Topology({ locale, label }: { locale: Locale; label?: string }) {
  const { attended, remembered, occupancy, reducedMotion } = useCondition()
  const [open, setOpen] = useState(false)
  const t = copy[locale]
  const nodes = useMemo(() => Object.values(attended), [attended])

  return (
    <>
      <button
        type="button"
        className="type-meta inline-flex items-center gap-2 text-ink/70 hover:text-ink"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <span className="inline-block size-1.5 rounded-full bg-ochre" aria-hidden />
        {label || t.open}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-night/35 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={t.open}
        >
          <div className="max-h-[86vh] w-full max-w-3xl overflow-auto border border-ink/15 bg-paper p-6 shadow-[0_24px_80px_rgba(14,12,9,0.28)] sm:p-10">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="type-meta text-ink/55">{t.open}</p>
                <p className="mt-3 type-title">
                  {occupancy} {t.occupancy}
                </p>
              </div>
              <button type="button" className="type-meta" onClick={() => setOpen(false)}>
                {t.close}
              </button>
            </div>
            {nodes.length === 0 ? (
              <p className="type-lede text-ink/70">{t.empty}</p>
            ) : (
              <svg
                viewBox="0 0 640 280"
                className="h-auto w-full"
                role="img"
                aria-label={nodes.map((n) => n.title).join(', ')}
              >
                {nodes.map((node, i) => {
                  const x = 70 + i * Math.min(140, 500 / Math.max(nodes.length - 1, 1))
                  const y = 80 + ((i % 3) * 48)
                  const next = nodes[i + 1]
                  return (
                    <g key={node.slug}>
                      {next ? (
                        <line
                          x1={x}
                          y1={y}
                          x2={70 + (i + 1) * Math.min(140, 500 / Math.max(nodes.length - 1, 1))}
                          y2={80 + (((i + 1) % 3) * 48)}
                          stroke="currentColor"
                          strokeOpacity="0.35"
                          strokeWidth="1"
                          className={reducedMotion ? '' : 'origin-left'}
                        />
                      ) : null}
                      <circle
                        cx={x}
                        cy={y}
                        r={remembered.includes(node.slug) ? 7 : 4.5}
                        fill={remembered.includes(node.slug) ? 'var(--acid)' : 'var(--ink)'}
                      />
                      <text
                        x={x}
                        y={y + 28}
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="11"
                        fontFamily="var(--font-mono)"
                      >
                        {node.title}
                      </text>
                    </g>
                  )
                })}
              </svg>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
