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

    const documentRoot = document.documentElement
    const previousOverflow = document.body.style.overflow
    const pageRegions = Array.from(document.querySelectorAll<HTMLElement>('main, .site-footer'))
    const desktop = window.matchMedia('(min-width: 1024px)')
    const focusable = () => [
      menuButton.current,
      ...Array.from(mobileNav.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || []),
    ].filter((item): item is HTMLElement => Boolean(item))

    documentRoot.dataset.mobileMenu = 'open'
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
      delete documentRoot.dataset.mobileMenu
      pageRegions.forEach((region) => region.removeAttribute('inert'))
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
    if (peekJourney()) return
    setThreadPlace(gateFromPath(pathname) === 'home' ? 'home' : 'inner')
  }, [pathname])

  useEffect(() => {
    const documentRoot = document.documentElement
    const mobileLanding = window.matchMedia('(max-width: 767.98px)')
    const isHome = pathname === `/${locale}`
    let frame = 0

    const update = () => {
      frame = 0
      if (isHome && mobileLanding.matches) {
        documentRoot.style.removeProperty('--mobile-command-progress')
        delete documentRoot.dataset.mobileCommandProgress
        return
      }

      const scrollingElement = document.scrollingElement || documentRoot
      const scrollable = Math.max(0, scrollingElement.scrollHeight - window.innerHeight)
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollingElement.scrollTop / scrollable)) : 0
      documentRoot.style.setProperty('--mobile-command-progress', progress.toFixed(4))
      documentRoot.dataset.mobileCommandProgress = 'scroll'
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }
    const resizeObserver = new ResizeObserver(scheduleUpdate)

    resizeObserver.observe(document.body)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    mobileLanding.addEventListener('change', scheduleUpdate)
    scheduleUpdate()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      mobileLanding.removeEventListener('change', scheduleUpdate)
      documentRoot.style.removeProperty('--mobile-command-progress')
      delete documentRoot.dataset.mobileCommandProgress
    }
  }, [locale, pathname])

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
          </div>
        </div>
      </header>
      <div className="mobile-command-bar md:hidden">
        <ThreadLink
          href={`/${locale}/work`}
          className="mobile-command-work no-underline type-meta"
          id="work"
          aria-current={pathname.startsWith(`/${locale}/work`) ? 'page' : undefined}
        >
          {labels.work}
        </ThreadLink>
        <span className="mobile-command-thread" aria-hidden="true">
          <span />
        </span>
        <button
          ref={menuButton}
          type="button"
          className="header-chip mobile-command-menu min-h-11 type-meta"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (locale === 'fr' ? 'Fermer' : 'Close') : 'Menu'}
        </button>
      </div>
      {open ? (
        <div className="mobile-nav-layer fixed inset-0 md:hidden">
          <button
            type="button"
            className="mobile-nav-scrim absolute inset-0"
            aria-label={locale === 'fr' ? 'Fermer le menu' : 'Close menu'}
            onClick={() => setOpen(false)}
          />
          <nav
            ref={mobileNav}
            id="mobile-nav"
            className="mobile-nav-panel absolute inset-x-0 bottom-0 overflow-auto bg-paper text-ink"
            aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'Primary mobile'}
          >
            <div className="mobile-nav-register site-shell">
              <p className="type-meta">{locale === 'fr' ? 'Index' : 'Index'}</p>
              <p>{locale === 'fr' ? 'Choisir une direction' : 'Choose a direction'}</p>
            </div>
            <div className="site-shell flex flex-col">
              {links.map((item, index) => {
                const href = `/${locale}${item.href}`
                const current = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <ThreadLink
                    key={item.href}
                    href={href}
                    className="mobile-nav-link min-h-14 no-underline"
                    id={item.href.replace('/', '')}
                    aria-current={current ? 'page' : undefined}
                  >
                    <span className="type-meta" aria-hidden="true">0{index + 1}</span>
                    <span className="font-display" onClick={() => setOpen(false)}>{item.label}</span>
                    <span aria-hidden="true">↗</span>
                  </ThreadLink>
                )
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
