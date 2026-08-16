import { notFound } from 'next/navigation'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SetHtmlLang } from '@/components/SetHtmlLang'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getGlobal } from '@/lib/payload'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [site, header, footer] = await Promise.all([
    getGlobal<{ locationLine?: string; email?: string }>('site', locale).catch(() => ({})),
    getGlobal<{ nav?: { label?: string; href?: string }[]; topologyLabel?: string }>('header', locale).catch(
      () => ({}),
    ),
    getGlobal<{ note?: string; contactLabel?: string }>('footer', locale).catch(() => ({})),
  ])

  return (
    <>
      <SetHtmlLang locale={locale} />
      <SiteHeader locale={locale} nav={header.nav} topologyLabel={header.topologyLabel} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        locale={locale}
        note={footer.note}
        contactLabel={footer.contactLabel}
        email={site.email}
        location={site.locationLine}
      />
    </>
  )
}
