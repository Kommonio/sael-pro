import Image from 'next/image'
import type { CSSProperties } from 'react'

import { cn } from '@/utilities/cn'

export function Still({
  src,
  alt,
  className = '',
  credit,
  position = 'center',
  transitionName,
  sizes = '100vw',
  priority = false,
}: {
  src?: string | null
  alt: string
  className?: string
  credit?: string | null
  position?: string
  transitionName?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn('relative overflow-hidden bg-[#0e0c09]', className)}
      style={transitionName ? ({ viewTransitionName: transitionName } as CSSProperties) : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      ) : null}
      {credit ? (
        <span className="still-credit type-meta pointer-events-none absolute bottom-3 right-3 text-paper/75 mix-blend-difference">
          {credit}
        </span>
      ) : null}
    </div>
  )
}
