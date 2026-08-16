import type { Metadata } from 'next'
import React from 'react'

import { boska, plexMono, satoshi } from '@/app/fonts'
import { ConditionProvider } from '@/condition/ConditionProvider'
import { SmoothScroll } from '@/condition/SmoothScroll'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

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
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'Saël Simard' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${boska.variable} ${satoshi.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#F1E8D4" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="climate-wash min-h-screen antialiased">
        <ConditionProvider>
          <SmoothScroll />
          {children}
        </ConditionProvider>
      </body>
    </html>
  )
}
