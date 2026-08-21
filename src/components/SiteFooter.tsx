import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

import { Mark } from './Mark'

export function SiteFooter({
  locale,
  note,
  contactLabel,
  email,
  location,
}: {
  locale: Locale
  note?: string | null
  contactLabel?: string | null
  email?: string | null
  location?: string | null
}) {
  const labels = t(locale)
  return (
    <footer className="mt-24 border-t border-ink/10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="site-shell grid gap-10 py-14 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <Mark className="h-16 w-auto sm:h-20" />
          <p className="mt-3 font-display text-2xl leading-none text-muted sm:text-3xl">Simard</p>
          <p className="mt-5 type-lede text-ink/70">
            {note ||
              (locale === 'fr'
                ? 'Je conçois les conditions d’une expérience — de l’image au système.'
                : 'I design the conditions for an experience — from image to system.')}
          </p>
        </div>
        <div className="sm:col-span-5 sm:pt-3">
          <p className="type-meta text-muted">{location || 'Montréal'}</p>
          <Link href={`/${locale}/contact`} className="mt-4 block type-title">
            {contactLabel || labels.contact}
          </Link>
          {email ? (
            <a href={`mailto:${email}`} className="mt-3 block text-ink/70">
              {email}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
