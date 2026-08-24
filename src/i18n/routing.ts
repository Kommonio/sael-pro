import { isLocale, negotiateLocale, type Locale } from './config'

export type LocaleRoute =
  | { kind: 'localized'; locale: Locale; pathname: string }
  | { kind: 'redirect'; locale: Locale; pathname: string }

export function resolveLocaleRoute(
  pathname: string,
  savedLocale: string | null | undefined,
  acceptLanguage: string | null | undefined,
): LocaleRoute {
  const segment = pathname.split('/')[1]
  if (isLocale(segment)) return { kind: 'localized', locale: segment, pathname }

  const locale = savedLocale && isLocale(savedLocale) ? savedLocale : negotiateLocale(acceptLanguage)
  return {
    kind: 'redirect',
    locale,
    pathname: pathname === '/' ? `/${locale}` : `/${locale}${pathname}`,
  }
}
