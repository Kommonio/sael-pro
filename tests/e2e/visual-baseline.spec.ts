import { test } from '@playwright/test'

import { auditLocales } from './fixtures/audit-content'
import { auditRoutes, auditViewports, openApp } from './support/app'

const captureBaselines = process.env.SAEL_CAPTURE_BASELINES === '1'

test.describe('opt-in M0 visual baseline matrix', () => {
  test.skip(!captureBaselines, 'Run npm run test:ux:baseline to capture the full audit matrix.')

  for (const locale of auditLocales) {
    for (const route of auditRoutes) {
      for (const width of auditViewports) {
        for (const reducedMotion of [false, true] as const) {
          test(`${locale}-${route.id}-${width}-${reducedMotion ? 'reduced' : 'normal'}`, async ({ browser }, testInfo) => {
            const context = await browser.newContext({
              viewport: { width, height: 900 },
              reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
              colorScheme: 'light',
            })
            const page = await context.newPage()
            await openApp(page, `/${locale}${route.path}`)
            await page.locator('.thread-node').first().waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined)
            await page.screenshot({
              path: testInfo.outputPath(`${locale}-${route.id}-${width}-${reducedMotion ? 'reduced' : 'normal'}.png`),
              fullPage: true,
              animations: 'disabled',
            })
            await context.close()
          })
        }
      }
    }
  }
})
