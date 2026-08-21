'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode, MouseEvent } from 'react'

import { threadNav } from '@/thread/camera'
import { umlaut } from '@/lib/umlaut'

export function WorkLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const router = useRouter()

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    const id = href.split('/').filter(Boolean).pop() || 'route'
    void threadNav.zoom(id, href).then((hit) => {
      if (hit) return
      void umlaut.through()
      router.push(href)
    })
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}
