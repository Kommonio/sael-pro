import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  localeCookieName,
} from './i18n/config'
import { resolveLocaleRoute } from './i18n/routing'

const PUBLIC_FILE = /\.(.*)$/

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

  const route = resolveLocaleRoute(
    pathname,
    request.cookies.get(localeCookieName)?.value,
    request.headers.get('accept-language'),
  )
  if (route.kind === 'localized') {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    requestHeaders.set('x-locale', route.locale)
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  const url = request.nextUrl.clone()
  url.pathname = route.pathname
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Accept-Language, Cookie')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
