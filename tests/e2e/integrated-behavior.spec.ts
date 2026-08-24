import { expect, test } from '@playwright/test'

import { openApp } from './support/app'

test('Home opens with explicit work-first proof and navigation', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 768, height: 684 })
  await openApp(page, '/en')

  const nodes = page.locator('.thread-node')
  await expect(nodes.nth(0)).toHaveAttribute('href', '/en/work')
  await expect(nodes.nth(0).getByText('View selected work', { exact: true })).toBeVisible()
  await expect(nodes.nth(1)).toHaveAttribute('href', '/en/work/azul-vivo')
  await expect(nodes.nth(1).getByText('Azul Vivo', { exact: true })).toBeVisible()
  await expect(nodes.nth(1).getByText('View case study', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible()
})

test('Interactive filter exposes seven native project destinations', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await openApp(page, '/en/work')

  const interactive = page.getByRole('button', { name: 'Interactive', exact: true })
  await interactive.click()
  await expect(interactive).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.thread-node')).toHaveCount(7)
  await expect(page.locator('.thread-node[href]')).toHaveCount(7)
  await expect(page.getByText('No projects match this filter yet.', { exact: true })).toHaveCount(0)
})

test('mobile Work is an authored field and its controls follow the surface beneath them', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openApp(page, '/en/work')

  await expect(page.locator('.mobile-work-index')).toBeVisible()
  await expect(page.locator('.work-thread-canvas')).toBeHidden()
  await expect(page.locator('.mobile-work-card')).toHaveCount(10)
  await expect(page.locator('html')).toHaveAttribute('data-mobile-surface', 'paper')

  await page.locator('.mobile-work-field').evaluate((field) => field.scrollIntoView({ block: 'start' }))
  await expect.poll(() => page.locator('html').getAttribute('data-mobile-surface')).toBe('night')
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveCSS('color', 'rgb(241, 232, 212)')
})

test('mobile Home keeps the thread subtle and the primary identity layers separate', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await openApp(page, '/en')

  await expect(page.locator('.mobile-home-progress')).toBeHidden()
  await expect(page.locator('.mobile-home-opening-thread')).toBeHidden()
  await expect(page.locator('.mobile-home-opening-peek')).toBeHidden()

  const portrait = await page.locator('.mobile-home-portrait').boundingBox()
  const name = await page.locator('.mobile-home-name').boundingBox()
  const command = await page.locator('.mobile-command-bar').boundingBox()
  expect(portrait).not.toBeNull()
  expect(name).not.toBeNull()
  expect(command).not.toBeNull()
  expect(name!.y).toBeGreaterThanOrEqual(portrait!.y + portrait!.height - 2)
  expect(command!.y).toBeGreaterThan(844 * 0.75)
})

test('mobile secondary destinations use their dedicated compositions', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 390, height: 844 })

  await openApp(page, '/en/lab')
  await expect(page.locator('.mobile-lab-index')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-mobile-surface', 'night')

  await openApp(page, '/en/about')
  await expect(page.locator('.content-page .content-land')).toBeVisible()
  await expect(page.locator('.content-page .essay-section').first()).toBeVisible()

  await openApp(page, '/en/contact')
  await expect(page.locator('.mobile-contact-opening')).toBeVisible()
  await expect(page.locator('.contact-after form')).toBeVisible()
})

test('media-rich and media-free cases expose intentional hero treatments', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  await openApp(page, '/en/work/azul-vivo')
  const mediaHero = page.locator('[data-hero-treatment="media"]')
  await expect(mediaHero).toBeVisible()
  await expect(mediaHero.getByRole('img').first()).toBeVisible()
  await expect(mediaHero.getByRole('heading', { level: 1 })).toBeVisible()

  await openApp(page, '/en/work/echoes')
  const typographicHero = page.locator('[data-hero-treatment="typographic"]')
  await expect(typographicHero).toBeVisible()
  await expect(typographicHero.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(typographicHero.getByRole('img')).toHaveCount(0)

  const box = await typographicHero.boundingBox()
  expect(box, 'The typographic hero needs deliberate, measurable geometry').not.toBeNull()
  expect(box?.height).toBeLessThanOrEqual(844 * 0.73)
})

test('case-study header follows the surface beneath it and Versus exposes its client', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openApp(page, '/en/work/versus')

  const root = page.locator('html')
  const menu = page.getByRole('button', { name: 'Menu', exact: true })
  await expect(root).toHaveAttribute('data-header', 'over-night')
  await expect(menu).toHaveCSS('color', 'rgb(243, 226, 208)')
  await expect(menu).toHaveCSS('background-color', /0\.12\)$/)

  await page.getByRole('link', { name: '05 Context', exact: true }).click()
  await expect(root).toHaveAttribute('data-header', 'paper')
  await expect(menu).toHaveCSS('color', 'rgb(28, 18, 14)')
  await expect(page.locator('dl').getByText('LINKVIVA', { exact: true })).toBeVisible()
})

test('generated editorial media replaces placeholders without duplicating the profile portrait', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 1440, height: 1000 })

  await openApp(page, '/en/about')
  await expect(page.locator('.content-land img')).toHaveAttribute('src', /about-systems-practice\.webp/)

  await openApp(page, '/en/contact')
  await expect(page.locator('[data-thread-id="contact"]')).toHaveAttribute('data-thread-has-still', 'true')

  await openApp(page, '/en/work/onmove')
  await expect(page.locator('[data-hero-treatment="media"] img').first()).toHaveAttribute(
    'src',
    /onmove-location-story\.webp/,
  )
})
