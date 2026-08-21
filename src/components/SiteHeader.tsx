'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { gateFromPath, peekJourney, setThreadPlace } from '@/thread/journey'

import { LocaleSwitcher } from './LocaleSwitcher'
import { Mark } from './Mark'
import { ThreadLink } from './ThreadLink'

type NavItem = { label?: string | null; href?: string | null }

export function SiteHeader({
  locale,
  nav,
}: {
  locale: Locale
  nav?: NavItem[] | null
}) {
  const labels = t(locale)
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const mobileNav = useRef<HTMLElement>(null)
  const fallback = [
    { label: labels.work, href: '/work' },
    { label: labels.practice, href: '/practice' },
    { label: labels.lab, href: '/lab' },
    { label: labels.about, href: '/about' },
    { label: labels.contact, href: '/contact' },
  ]
  const items = (nav || []).filter((item): item is { label: string; href: string } =>
    Boolean(item.label && item.href),
  )
  const links = items.length ? items : fallback

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const pageRegions = Array.from(document.querySelectorAll<HTMLElement>('main, .site-footer'))
    const desktop = window.matchMedia('(min-width: 768px)')
    const focusable = () => [
      menuButton.current,
      ...Array.from(mobileNav.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || []),
    ].filter((item): item is HTMLElement => Boolean(item))

    document.body.style.overflow = 'hidden'
    pageRegions.forEach((region) => region.setAttribute('inert', ''))

    const focusFirstLink = window.requestAnimationFrame(() => focusable()[1]?.focus())
    const closeForDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        window.requestAnimationFrame(() => menuButton.current?.focus())
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    desktop.addEventListener('change', closeForDesktop)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFirstLink)
      desktop.removeEventListener('change', closeForDesktop)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      pageRegions.forEach((region) => region.removeAttribute('inert'))
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
    if (peekJourney()) return
    setThreadPlace(gateFromPath(pathname) === 'home' ? 'home' : 'inner')
  }, [pathname])

  return (
    <>
      <header className="site-header sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="site-shell flex h-[3.75rem] items-center justify-between gap-4">
          <ThreadLink
            href={`/${locale}`}
            className="shrink-0 no-underline"
            id="home"
            aria-label="Saël Simard"
            aria-current={pathname === `/${locale}` ? 'page' : undefined}
          >
            <span onClick={() => setOpen(false)}>
              <Mark className="h-10 w-auto sm:h-11" />
            </span>
          </ThreadLink>
          <nav
            className="header-nav hidden items-center gap-6 md:flex"
            aria-label={locale === 'fr' ? 'Navigation principale' : 'Primary'}
          >
            {links.map((item) => {
              const href = `/${locale}${item.href}`
              const current = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <ThreadLink
                  key={item.href}
                  href={href}
                  className="type-meta"
                  id={item.href.replace('/', '')}
                  aria-current={current ? 'page' : undefined}
                >
                  {item.label}
                </ThreadLink>
              )
            })}
          </nav>
          <div className="header-locale flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <button
              ref={menuButton}
              type="button"
              className="header-chip min-h-11 border border-current/25 px-3 py-2 type-meta md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (locale === 'fr' ? 'Fermer' : 'Close') : 'Menu'}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <nav
          ref={mobileNav}
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[calc(3.75rem+env(safe-area-inset-top))] z-50 overflow-auto border-t border-ink/10 bg-paper text-ink md:hidden"
          aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'Primary mobile'}
        >
          <div className="site-shell flex flex-col gap-1 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {links.map((item) => {
              const href = `/${locale}${item.href}`
              const current = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <ThreadLink
                  key={item.href}
                  href={href}
                  className="min-h-14 border-b border-ink/10 py-4 font-display text-4xl no-underline"
                  id={item.href.replace('/', '')}
                  aria-current={current ? 'page' : undefined}
                >
                  <span onClick={() => setOpen(false)}>{item.label}</span>
                </ThreadLink>
              )
            })}
          </div>
        </nav>
      ) : null}
    </>
  )
}
