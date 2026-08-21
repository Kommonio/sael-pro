import type { CSSProperties } from 'react'

import { coverFor } from '@/lib/covers'
import { focalPoint, mediaUrl, type MediaDoc } from '@/lib/media'
import { cn } from '@/utilities/cn'

import { Still } from './Still'

const COVER: Record<string, { base: string; wash: string }> = {
  earth: { base: '#c9a227', wash: '#6b4a1a' },
  sap: { base: '#2f6f6a', wash: '#16352c' },
  clay: { base: '#b45a32', wash: '#5c2414' },
  moss: { base: '#4a5a30', wash: '#1e2a14' },
  acid: { base: '#e6d24a', wash: '#6a5a10' },
}

export function MediaFigure({
  media,
  alt,
  title,
  slug,
  src: srcProp,
  climate = 'earth',
  className = '',
  credit,
  overlay = true,
  sizes = '100vw',
  priority = false,
}: {
  media?: MediaDoc | number | null
  alt?: string
  title?: string
  slug?: string
  src?: string | null
  climate?: string
  sizes?: string
  priority?: boolean
  className?: string
  credit?: string | null
  overlay?: boolean
}) {
  const fallback = coverFor(slug)
  const cmsSrc =
    mediaUrl(typeof media === 'object' ? media : null, 'xlarge') ||
    mediaUrl(typeof media === 'object' ? media : null)
  const src = srcProp || cmsSrc || fallback?.src || null
  const resolvedAlt = alt || (typeof media === 'object' ? media?.alt : '') || fallback?.alt || title || ''
  const resolvedCredit =
    credit || (typeof media === 'object' ? media?.credit : null) || fallback?.credit || null
  const tone = COVER[climate] || COVER.earth

  return (
    <figure
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={
        src
          ? undefined
          : ({
              ['--cover' as string]: tone.base,
              ['--cover-wash' as string]: tone.wash,
            } as CSSProperties)
      }
    >
      {src ? (
        <Still
          src={src}
          alt={resolvedAlt}
          credit={resolvedCredit}
          position={focalPoint(media)}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0"
        />
      ) : (
        <div className="cover-field absolute inset-0" aria-hidden />
      )}
      {overlay && title ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 via-night/15 to-transparent px-6 pb-6 pt-24">
          <span className="font-display text-3xl leading-[0.92] text-paper sm:text-5xl">{title}</span>
        </span>
      ) : null}
    </figure>
  )
}
