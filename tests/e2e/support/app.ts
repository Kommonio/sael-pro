import { expect, type Page, type TestInfo } from '@playwright/test'

import { contactAuditScenarios, type AuditLocale } from '../fixtures/audit-content'

export const auditViewports = [320, 390, 768, 1023, 1024, 1025, 1440] as const

export const auditRoutes = [
  { id: 'home', path: '' },
  { id: 'work', path: '/work' },
  { id: 'lab', path: '/lab' },
  { id: 'contact', path: '/contact' },
  { id: 'media-rich-case', path: '/work/azul-vivo' },
  { id: 'media-free-case', path: '/work/echoes' },
] as const

export async function openApp(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
  expect(response, `No document response was returned for ${path}`).not.toBeNull()
  expect(response?.ok(), `${path} returned ${response?.status()}`).toBe(true)
  await expect(page.locator('main')).toHaveCount(1)
  // Waiting for network idle prevents interactions from racing React hydration.
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined)
}

export function recordKnownDebt(testInfo: TestInfo, ...issues: string[]) {
  for (const description of issues) {
    testInfo.annotations.push({ type: 'known-ux-debt', description })
  }
}

export async function measureHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
    const offenders = [...document.body.querySelectorAll<HTMLElement>('*')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          element: element.tagName.toLowerCase(),
          id: element.id,
          className: typeof element.className === 'string' ? element.className : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflow: Math.max(0, -rect.left, rect.right - viewportWidth),
        }
      })
      .filter((item) => item.width > 0 && (item.left < -1 || item.right > viewportWidth + 1))
      .sort((a, b) => b.overflow - a.overflow)
      .slice(0, 12)

    return { viewportWidth, documentWidth, offenders }
  })
}

export async function mockContact(
  page: Page,
  scenario: keyof typeof contactAuditScenarios,
) {
  const fixture = contactAuditScenarios[scenario]
  await page.route('**/api/contact', async (route) => {
    if ('abort' in fixture.response) {
      await route.abort(fixture.response.abort)
      return
    }
    await route.fulfill({
      status: fixture.response.status,
      contentType: 'application/json',
      body: JSON.stringify(fixture.response.body),
    })
  })
}

export async function submitContact(page: Page, locale: AuditLocale) {
  const labels =
    locale === 'fr'
      ? { name: 'Nom', email: 'Courriel', message: 'Message', submit: 'Envoyer' }
      : { name: 'Name', email: 'Email', message: 'Message', submit: 'Send' }

  await page.getByLabel(labels.name, { exact: true }).fill('Ada Lovelace')
  await page.getByLabel(labels.email, { exact: true }).fill('ada@example.test')
  await page.getByLabel(labels.message, { exact: true }).fill('Deterministic contact fixture')
  await page.getByRole('button', { name: labels.submit, exact: true }).click()
}
