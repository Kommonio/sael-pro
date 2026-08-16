'use client'

import { usePathname, useRouter } from 'next/navigation'

import { localeCookieName, locales, type Locale } from '@/i18n/config'

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (next: Locale) => {
    document.cookie = `${localeCookieName}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    const parts = pathname.split('/')
    if (parts[1] === 'en' || parts[1] === 'fr') parts[1] = next
    router.push(parts.join('/') || `/${next}`)
  }

  return (
    <div className="flex items-center gap-2 type-meta">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={code === locale ? 'text-ink' : 'text-ink/45 hover:text-ink'}
          aria-current={code === locale ? 'true' : undefined}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
