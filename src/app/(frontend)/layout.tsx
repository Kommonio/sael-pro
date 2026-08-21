import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import React from 'react'

import { boska, plexMono, satoshi } from '@/app/fonts'
import { UmlautLayer } from '@/components/UmlautLayer'
import { ConditionProvider } from '@/condition/ConditionProvider'
import { SmoothScroll } from '@/condition/SmoothScroll'
import { defaultLocale, isLocale } from '@/i18n/config'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F1E8D4',
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Saël Simard',
    template: '%s — Saël Simard',
  },
  description: 'I design the conditions for an experience — from image to system.',
  applicationName: 'sael.pro',
  openGraph: {
    siteName: 'Saël Simard',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Saël Simard' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()
  const requestedLocale = requestHeaders.get('x-locale') || ''
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale

  return (
    <html
      lang={locale}
      className={`${boska.variable} ${satoshi.variable} ${plexMono.variable}`}
      data-header="paper"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#F1E8D4" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="climate-wash min-h-screen antialiased">
        <ConditionProvider>
          <SmoothScroll />
          <UmlautLayer />
          {children}
        </ConditionProvider>
      </body>
    </html>
  )
}
