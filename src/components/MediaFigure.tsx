import Image from 'next/image'

import { focalPoint, mediaUrl, type MediaDoc } from '@/lib/media'

const COVER: Record<string, string> = {
  earth: '#c9a227',
  sap: '#3f5a2e',
  clay: '#b45a32',
  moss: '#4a5a30',
  acid: '#e6d24a',
}

export function MediaFigure({
  media,
  alt,
  title,
  climate = 'earth',
  sizes = '(min-width: 1440px) 70vw, 100vw',
  priority = false,
  className = '',
  credit,
}: {
  media?: MediaDoc | number | null
  alt?: string
  title?: string
  climate?: string
  sizes?: string
  priority?: boolean
  className?: string
  credit?: string | null
}) {
  const src = mediaUrl(typeof media === 'object' ? media : null, 'xlarge') || mediaUrl(typeof media === 'object' ? media : null)
  const resolvedAlt = alt || (typeof media === 'object' ? media?.alt : '') || title || ''
  const resolvedCredit = credit || (typeof media === 'object' ? media?.credit : null)

  return (
    <figure className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={resolvedAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: focalPoint(typeof media === 'object' ? media : null) }}
        />
      ) : (
        <div
          className="cover-field absolute inset-0"
          style={{ ['--cover' as string]: COVER[climate] || COVER.earth }}
          aria-hidden
        >
          {title ? (
            <span className="absolute bottom-6 left-6 right-6 font-display text-3xl text-paper/90 sm:text-5xl">
              {title}
            </span>
          ) : null}
        </div>
      )}
      {resolvedCredit ? (
        <figcaption className="type-meta pointer-events-none absolute bottom-3 right-3 text-paper/80 mix-blend-difference">
          {resolvedCredit}
        </figcaption>
      ) : null}
    </figure>
  )
}
