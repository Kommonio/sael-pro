import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  negotiateLocale,
  type Locale,
} from './i18n/config'

const PUBLIC_FILE = /\.(.*)$/
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function resolvePreferredLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(localeCookieName)?.value
  if (fromCookie && isLocale(fromCookie)) return fromCookie
  return negotiateLocale(request.headers.get('accept-language'))
}

function withLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(localeCookieName, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/next') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const segment = pathname.split('/')[1]
  if (isLocale(segment)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    requestHeaders.set('x-locale', segment)
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    })
    if (request.cookies.get(localeCookieName)?.value !== segment) {
      withLocaleCookie(response, segment)
    }
    return response
  }

  const locale = resolvePreferredLocale(request) || defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return withLocaleCookie(NextResponse.redirect(url), locale)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
