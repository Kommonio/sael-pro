import { expect, test } from '@playwright/test'

import { auditLocales } from './fixtures/audit-content'
import { openApp } from './support/app'

test.use({ javaScriptEnabled: false })

const routes = [
  { id: 'home', path: '', primaryHref: /\/work$/, minimumNodes: 6 },
  { id: 'work', path: '/work', primaryHref: /\/work\/.+/, minimumNodes: 10 },
  { id: 'lab', path: '/lab', primaryHref: /^https?:\/\//, minimumNodes: 2 },
  { id: 'contact', path: '/contact', primaryHref: /^mailto:/, minimumNodes: 1 },
  { id: 'about', path: '/about' },
  { id: 'media-rich-case', path: '/work/azul-vivo' },
  { id: 'media-free-case', path: '/work/echoes' },
] as const

for (const locale of auditLocales) {
  for (const route of routes) {
    test(`${locale.toUpperCase()} ${route.id} exposes its document contract without JavaScript`, async ({ page }) => {
      await openApp(page, `/${locale}${route.path}`)

      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('header.site-header')).toHaveCount(1)
      await expect(page.locator('main')).toHaveCount(1)
      await expect(page.locator('footer')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('header.site-header nav[aria-label]')).toHaveCount(1)

      const links = page.locator('a[href]')
      expect(await links.count()).toBeGreaterThan(0)
      for (const href of await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')))) {
        expect(href?.trim(), 'Every server-rendered anchor needs a destination').not.toBe('')
      }

      if ('primaryHref' in route) {
        const nodes = page.locator('main .thread-node')
        expect(await nodes.count()).toBeGreaterThanOrEqual(route.minimumNodes)
        for (const text of await nodes.allTextContents()) expect(text.trim()).not.toBe('')
        expect(await nodes.locator('xpath=self::a[@href]').count()).toBeGreaterThan(0)

        const hrefs = await page.locator('main a[href]').evaluateAll((items) =>
          items.map((item) => item.getAttribute('href') || ''),
        )
        expect(
          hrefs.some((href) => route.primaryHref.test(href)),
          `${route.id} is missing a server-rendered primary destination: ${hrefs.join(', ')}`,
        ).toBe(true)
      }
    })
  }
}

test('the localized primary navigation is made of native links', async ({ page }) => {
  await openApp(page, '/fr/about')
  const nav = page.locator('header.site-header nav[aria-label]')
  await expect(nav.locator('a[href^="/fr/"]')).toHaveCount(5)
  await expect(nav.locator('[role="button"]')).toHaveCount(0)
})
