import { expect, test } from '@playwright/test'

import { openApp } from './support/app'

test('Home opens with explicit work-first proof and navigation', async ({ page }) => {
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
  await page.setViewportSize({ width: 390, height: 844 })
  await openApp(page, '/en/work')

  const interactive = page.getByRole('button', { name: 'Interactive', exact: true })
  await interactive.click()
  await expect(interactive).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.thread-node')).toHaveCount(7)
  await expect(page.locator('.thread-node[href]')).toHaveCount(7)
  await expect(page.getByText('No projects match this filter yet.', { exact: true })).toHaveCount(0)
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
  await expect(menu).toHaveCSS('background-color', /0\.26\)$/)

  await page.getByRole('link', { name: '05 Context', exact: true }).click()
  await expect(root).toHaveAttribute('data-header', 'paper')
  await expect(menu).toHaveCSS('color', 'rgb(28, 18, 14)')
  await expect(page.locator('dl').getByText('LINKVIVA', { exact: true })).toBeVisible()
})
