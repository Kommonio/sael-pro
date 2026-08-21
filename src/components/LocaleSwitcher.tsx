'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'

import { localeCookieName, localeLabels, locales, type Locale } from '@/i18n/config'

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const hrefFor = (next: Locale) => {
    const parts = pathname.split('/')
    if (parts[1] === 'en' || parts[1] === 'fr') parts[1] = next
    return parts.join('/') || `/${next}`
  }

  const switchTo = async (event: MouseEvent<HTMLAnchorElement>, next: Locale, url: string) => {
    if (next === locale) {
      event.preventDefault()
      return
    }
    document.cookie = `${localeCookieName}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    try {
      const { threadNav } = await import('@/thread/camera')
      const { umlaut } = await import('@/lib/umlaut')
      const hit = await threadNav.zoom('locale', url)
      if (!hit) {
        await umlaut.flip()
        router.push(url)
      }
    } catch {
      router.push(url)
    }
  }

  return (
    <div className="flex items-center gap-2 type-meta">
      {locales.map((code) => {
        const href = hrefFor(code)
        return (
          <Link
            key={code}
            href={href}
            hrefLang={code}
            lang={code}
            onClick={(event) => void switchTo(event, code, href)}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-1 ${
              code === locale ? 'text-current' : 'text-current opacity-70 hover:opacity-100'
            }`}
            aria-label={localeLabels[code]}
            aria-current={code === locale ? 'page' : undefined}
          >
            {code}
          </Link>
        )
      })}
    </div>
  )
}
