import Link from 'next/link'

import { Topology } from '@/condition/Topology'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'

type NavItem = { label?: string | null; href?: string | null }

export function SiteHeader({
  locale,
  nav,
  topologyLabel,
}: {
  locale: Locale
  nav?: NavItem[] | null
  topologyLabel?: string | null
}) {
  const labels = t(locale)
  const items =
    nav && nav.length
      ? nav
      : [
          { label: labels.work, href: '/work' },
          { label: labels.practice, href: '/practice' },
          { label: labels.lab, href: '/lab' },
          { label: labels.about, href: '/about' },
          { label: labels.contact, href: '/contact' },
        ]

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/78 backdrop-blur-md">
      <div className="site-shell flex h-[4.25rem] items-center justify-between gap-4">
        <Link href={`/${locale}`} className="no-underline" aria-label="Saël Simard">
          <Logo markClassName="size-9" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {items.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="type-meta text-ink/70 hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Topology locale={locale} label={topologyLabel || undefined} />
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
      <nav className="site-shell flex gap-4 overflow-x-auto pb-3 md:hidden" aria-label="Primary mobile">
        {items.map((item) => (
          <Link key={item.href} href={`/${locale}${item.href}`} className="type-meta whitespace-nowrap text-ink/70">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
