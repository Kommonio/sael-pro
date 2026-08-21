'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'

import { threadNav } from '@/thread/camera'

export function ThreadLink({
  href,
  children,
  className,
  id = 'route',
  ...rest
}: {
  href: string
  children: ReactNode
  className?: string
  id?: string
  [key: string]: unknown
}) {
  const router = useRouter()

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    void threadNav.travel(id, href).then((hit) => {
      if (!hit) router.push(href)
    })
  }

  return (
    <Link href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  )
}
