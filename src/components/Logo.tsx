import { cn } from '@/utilities/cn'

import { Mark } from './Mark'

type LogoProps = {
  className?: string
  markClassName?: string
  wordmark?: boolean
  wordmarkClassName?: string
  title?: string
}

export function LogoMark({ className, title = 'Saël Simard' }: { className?: string; title?: string }) {
  return <Mark className={className} title={title} />
}

export function Logo({
  className,
  markClassName,
  wordmark = false,
  wordmarkClassName,
  title = 'Saël Simard',
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-ink', className)}>
      <Mark className={markClassName} title={title} />
      {wordmark ? (
        <span className={cn('font-display text-[1.55rem] leading-none tracking-tight', wordmarkClassName)}>
          Simard
        </span>
      ) : null}
    </span>
  )
}
