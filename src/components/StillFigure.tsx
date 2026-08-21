import { forwardRef } from 'react'

import type { Cover } from '@/lib/covers'

import { Still } from './Still'

export const StillFigure = forwardRef<HTMLElement, { cover: Cover; size?: 'md' | 'lg' | 'xl' }>(
  function StillFigure({ cover, size = 'lg' }, ref) {
    const sizes =
      size === 'xl'
        ? '(min-width: 768px) 35rem, 82vw'
        : size === 'md'
          ? '(min-width: 768px) 22.5rem, 58vw'
          : '(min-width: 768px) 30rem, 78vw'
    return (
      <figure ref={ref} className={`still-figure still-figure--${size}`}>
        <Still src={cover.src} alt={cover.alt} sizes={sizes} className="still-figure-disc" priority={size === 'xl'} />
        {cover.credit ? <figcaption className="type-meta mt-3 text-center text-ink/40">{cover.credit}</figcaption> : null}
      </figure>
    )
  },
)
