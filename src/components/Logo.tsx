import { cn } from '@/utilities/cn'

type LogoProps = {
  className?: string
  markClassName?: string
  wordmark?: boolean
  wordmarkClassName?: string
  title?: string
}

/** Custom S with an open condition-ring and two staggered still-points (from ë). */
export function LogoMark({ className, title = 'Saël Simard' }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('overflow-visible', className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M37.6 13.2a15.8 15.8 0 1 0 3.05 9.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        fill="currentColor"
        d="M30.15 16.05c0-2.72-2.28-4.58-5.82-4.58-3.95 0-6.42 2.18-6.62 5.38h3.18c.22-1.42 1.42-2.38 3.32-2.38 1.62 0 2.58.82 2.58 2.02 0 1.22-.78 1.82-3.58 2.66-3.58 1.08-5.72 2.62-5.72 5.72 0 3.18 2.42 5.22 6.38 5.22 3.82 0 6.48-2.12 6.78-5.42h-3.22c-.28 1.48-1.58 2.48-3.52 2.48-1.78 0-2.92-.88-2.92-2.22 0-1.22.78-1.88 3.68-2.78 3.62-1.08 5.98-2.62 5.98-6.1Z"
      />
      <circle cx="31.35" cy="10.15" r="1.62" className="fill-ochre" />
      <circle cx="36.05" cy="11.55" r="1.62" className="fill-ochre" />
    </svg>
  )
}

export function Logo({
  className,
  markClassName,
  wordmark = true,
  wordmarkClassName,
  title = 'Saël Simard',
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-ink', className)}>
      <LogoMark className={cn('size-8 shrink-0', markClassName)} title={title} />
      {wordmark ? (
        <span className={cn('font-display text-[1.45rem] leading-none tracking-tight', wordmarkClassName)}>
          Saël
        </span>
      ) : null}
    </span>
  )
}
