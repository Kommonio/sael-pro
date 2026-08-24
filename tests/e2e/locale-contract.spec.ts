import { expect, test } from '@playwright/test'

import { negotiateLocale } from '../../src/i18n/config'
import { resolveLocaleRoute } from '../../src/i18n/routing'

test.describe('locale routing contract', () => {
  test('negotiates supported browser languages by quality', () => {
    expect(negotiateLocale('fr-CA,fr;q=0.9,en;q=0.6')).toBe('fr')
    expect(negotiateLocale('de-DE,en-CA;q=0.8,fr;q=0.4')).toBe('en')
    expect(negotiateLocale('fr;q=0,en;q=0.8')).toBe('en')
  })

  test('redirects a first unprefixed visit to the browser language', () => {
    expect(resolveLocaleRoute('/', undefined, 'fr-CA,fr;q=0.9,en;q=0.6')).toEqual({
      kind: 'redirect',
      locale: 'fr',
      pathname: '/fr',
    })
  })

  test('preserves an explicit switcher preference on unprefixed routes', () => {
    expect(resolveLocaleRoute('/work/azul-vivo', 'fr', 'en-CA,en;q=0.9')).toEqual({
      kind: 'redirect',
      locale: 'fr',
      pathname: '/fr/work/azul-vivo',
    })
  })

  test('keeps already-localized routes stable without overwriting preference', () => {
    expect(resolveLocaleRoute('/fr/about', undefined, 'en-CA,en;q=0.9')).toEqual({
      kind: 'localized',
      locale: 'fr',
      pathname: '/fr/about',
    })
  })
})
