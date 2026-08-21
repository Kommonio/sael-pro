import { expect, test } from '@playwright/test'

import { contactAuditScenarios } from './fixtures/audit-content'
import { mockContact, openApp, submitContact } from './support/app'

test('reduced motion is active on first paint and route navigation avoids the thread transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openApp(page, '/en/about')
  await expect.poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

  const durations = await page.locator('html, body, header').evaluateAll((elements) =>
    elements.map((element) => ({
      animation: getComputedStyle(element).animationDuration,
      transition: getComputedStyle(element).transitionDuration,
    })),
  )
  for (const duration of durations) {
    expect(Number.parseFloat(duration.animation) || 0).toBeLessThanOrEqual(0.001)
    expect(Number.parseFloat(duration.transition) || 0).toBeLessThanOrEqual(0.001)
  }

  await page.locator('header nav[aria-label="Primary"] a[href="/en/work"]').click()
  await expect(page).toHaveURL(/\/en\/work$/)
  await expect(page.locator('html')).not.toHaveAttribute('data-thread-moving', /.+/)
})

for (const locale of ['en', 'fr'] as const) {
  test(`${locale.toUpperCase()} Contact exposes the deterministic success state`, async ({ page }) => {
    await mockContact(page, 'success')
    await openApp(page, `/${locale}/contact`)
    const request = page.waitForRequest('**/api/contact')
    await submitContact(page, locale)
    await request
    await expect(page.locator('form')).toHaveCount(0)
    await expect(page.getByRole('status')).toHaveText(contactAuditScenarios.success.expected[locale])
  })

  test(`${locale.toUpperCase()} Contact exposes the deterministic HTTP error state`, async ({ page }) => {
    await mockContact(page, 'httpError')
    await openApp(page, `/${locale}/contact`)
    const request = page.waitForRequest('**/api/contact')
    await submitContact(page, locale)
    await request
    await expect(page.locator('form [role="alert"]')).toHaveText(contactAuditScenarios.httpError.expected[locale])
  })

  test(`${locale.toUpperCase()} Contact recovers from a deterministic network error`, async ({ page }) => {
    await mockContact(page, 'networkError')
    await openApp(page, `/${locale}/contact`)
    await submitContact(page, locale)
    await expect(page.locator('form [role="alert"]')).toHaveText(contactAuditScenarios.networkError.expected[locale])
  })
}

test('Contact prevents duplicate submits while a request is pending', async ({ page }) => {
  let requestCount = 0
  await page.route('**/api/contact', async (route) => {
    requestCount += 1
    await new Promise((resolve) => setTimeout(resolve, 500))
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await openApp(page, '/en/contact')
  await page.getByLabel('Name', { exact: true }).fill('Ada Lovelace')
  await page.getByLabel('Email', { exact: true }).fill('ada@example.test')
  await page.getByLabel('Message', { exact: true }).fill('One message only')
  const form = page.locator('form')
  const submit = form.locator('button[type="submit"]')
  await submit.click()
  await expect(submit).toBeDisabled()
  await expect(form).toHaveAttribute('aria-busy', 'true')
  await submit.click({ force: true })
  await expect.poll(() => requestCount).toBe(1)
})
