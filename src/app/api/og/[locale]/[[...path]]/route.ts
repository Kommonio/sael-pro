import { NextResponse } from 'next/server'

import { isLocale } from '@/i18n/config'
import { getOrCreateOgBlob } from '@/lib/og/blob'
import { resolveOgDescriptor } from '@/lib/og/descriptor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; path?: string[] }> }) {
  const { locale, path = [] } = await params
  if (!isLocale(locale)) return NextResponse.json({ error: 'Unsupported locale' }, { status: 404 })

  const descriptor = await resolveOgDescriptor(locale, path)
  if (!descriptor) return NextResponse.json({ error: 'Unknown share image' }, { status: 404 })

  try {
    const blob = await getOrCreateOgBlob(descriptor)
    const response = NextResponse.redirect(blob.url, 302)
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800')
    response.headers.set('X-Sael-Og-Blob', blob.pathname)
    return response
  } catch (error) {
    console.error('[og] Failed to resolve Blob share image', error)
    return NextResponse.json({ error: 'Share image unavailable' }, { status: 503 })
  }
}
