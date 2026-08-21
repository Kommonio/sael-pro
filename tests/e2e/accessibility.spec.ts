import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { openApp } from './support/app'

const routes = ['/en', '/en/about', '/en/work/azul-vivo', '/fr/contact'] as const

for (const path of routes) {
  test(`${path} has no applicable WCAG A/AA axe violations`, async ({ page }, testInfo) => {
    await openApp(page, path)
    await page.locator('body').waitFor({ state: 'visible' })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })
    expect(
      results.violations,
      results.violations.map(({ id, impact, nodes }) => `${id} (${impact}): ${nodes.length}`).join('\n'),
    ).toEqual([])
  })
}
