'use client'

import type { MouseEvent, ReactNode } from 'react'

import type { PlacedNode } from '@/thread/graph'
import { inspectLayout } from '@/thread/inspect'

import { Still } from './Still'

export function ThreadNode({
  item,
  width,
  height,
  grown,
  side,
  onEnter,
}: {
  item: PlacedNode
  width: number
  height: number
  grown: boolean
  side: 'left' | 'right'
  onEnter: () => void
}) {
  const layout = inspectLayout(item, width, height, grown)
  const hit = grown ? layout.disc : Math.max(44, layout.idle * 3.2)
  const disc = grown ? layout.disc : layout.idle
  const fill = item.kind === 'night' ? '#1A1610' : '#C9A227'
  const align =
    layout.align === 'right' ? 'text-right' : layout.align === 'center' ? 'text-center' : 'text-left'

  const className = `thread-node absolute ${item.href ? 'cursor-pointer' : ''} ${grown ? 'z-30' : 'z-10'}`
  const style = { left: item.x, top: item.y }
  const content: ReactNode = (
    <>
      <span
        className="thread-blob absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        style={{ width: hit, height: hit }}
      >
        <span
          className="thread-disc absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{
            width: disc,
            height: disc,
            background: grown && item.still ? '#0e0c09' : grown ? 'var(--paper)' : fill,
            boxShadow: grown
              ? '0 0 0 1.5px var(--ochre), 0 18px 40px color-mix(in srgb, var(--ink) 16%, transparent)'
              : item.kind === 'ring'
                ? 'inset 0 0 0 1.5px var(--ochre)'
                : 'none',
          }}
        >
          {item.still ? (
            <span className="absolute inset-0" style={{ opacity: grown ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <Still
                src={item.still}
                alt={item.label}
                credit={grown ? item.credit : undefined}
                className="absolute inset-0"
              />
            </span>
          ) : null}
        </span>
      </span>
      <span
        className={`thread-copy absolute block ${align}`}
        style={{
          left: layout.copyX,
          top: layout.copyY,
          width: layout.copyW,
        }}
      >
        <span className="thread-heading block">
          {item.meta ? <p className="type-meta text-muted">{item.meta}</p> : null}
          <p className="thread-title font-display leading-[0.95]" style={{ fontSize: layout.title }}>
            {item.label}
          </p>
        </span>
        <span
          className={`thread-inspect block ${item.loose ? 'thread-inspect-loose' : ''}`}
          style={{
            maxHeight: grown && (item.detail || item.enter) ? (item.loose ? 2400 : 220) : 0,
            opacity: grown && (item.detail || item.enter) ? 1 : 0,
          }}
        >
          {item.detail ? (
            <p className={`mt-3 leading-relaxed text-ink/70 ${item.loose ? 'type-body whitespace-pre-line' : 'text-sm'}`}>
              {item.detail}
            </p>
          ) : null}
          {item.enter && item.href ? <p className="type-meta mt-3 text-accent">{item.enter}</p> : null}
        </span>
      </span>
    </>
  )

  if (item.href) {
    const internal = item.href.startsWith('/')
    const handleLink = (event: MouseEvent<HTMLAnchorElement>) => {
      if (!internal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
      event.preventDefault()
      onEnter()
    }
    return (
      <a
        href={item.href}
        className={className}
        style={style}
        data-thread-id={item.id}
        data-thread-side={side}
        data-thread-weight={item.weight}
        data-thread-kind={item.kind}
        data-thread-has-still={item.still ? 'true' : 'false'}
        onClick={handleLink}
      >
        {content}
      </a>
    )
  }

  if (item.detail) {
    return (
      <button
        type="button"
        aria-expanded={grown}
        className={className}
        style={style}
        data-thread-id={item.id}
        data-thread-side={side}
        data-thread-weight={item.weight}
        data-thread-kind={item.kind}
        data-thread-has-still={item.still ? 'true' : 'false'}
        onClick={onEnter}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      className={className}
      style={style}
      data-thread-id={item.id}
      data-thread-side={side}
      data-thread-weight={item.weight}
      data-thread-kind={item.kind}
      data-thread-has-still={item.still ? 'true' : 'false'}
    >
      {content}
    </div>
  )
}
