import { expect, test } from '@playwright/test'

import { measureHorizontalOverflow, openApp } from './support/app'

const overflowMatrix = [
  ...[320, 390, 768, 1023, 1024, 1025, 1440].map((width) => ({ path: '/en', width })),
  ...[320, 390].flatMap((width) => [
    { path: '/en/work', width },
    { path: '/en/about', width },
    { path: '/en/practice', width },
    { path: '/en/lab', width },
    { path: '/en/contact', width },
    { path: '/en/work/azul-vivo', width },
    { path: '/en/work/onmove', width },
  ]),
  ...[1023, 1024, 1025].map((width) => ({ path: '/en/work', width })),
  { path: '/fr/contact', width: 320 },
  { path: '/fr/contact', width: 390 },
] as const

for (const { path, width } of overflowMatrix) {
  test(`${path} has no document-level horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await openApp(page, path)
    await page
      .locator(
        '.thread-node:visible, .mobile-home-journey:visible, .mobile-work-index:visible, .mobile-lab-index:visible, .mobile-contact-opening:visible, .content-page:visible, .case-hero:visible',
      )
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => undefined)

    const measurement = await measureHorizontalOverflow(page)
    expect(
      measurement.documentWidth,
      `Viewport ${measurement.viewportWidth}px; overflow offenders: ${JSON.stringify(measurement.offenders)}`,
    ).toBeLessThanOrEqual(measurement.viewportWidth + 1)
  })
}

for (const locale of ['en', 'fr'] as const) {
  for (const width of [320, 390] as const) {
    test(`${locale.toUpperCase()} menu has usable geometry at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 780 })
      await openApp(page, `/${locale}/about`)

      const toggle = page.locator('button[aria-controls="mobile-nav"]')
      await expect(toggle).toHaveAccessibleName('Menu')
      await toggle.click()
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')

      const menu = page.locator('#mobile-nav')
      await expect(menu).toBeVisible()
      const box = await menu.boundingBox()
      expect(box, 'The expanded menu needs a measurable panel').not.toBeNull()
      expect(box?.x).toBeGreaterThanOrEqual(-1)
      expect(box?.width).toBeGreaterThanOrEqual(width - 2)
      expect(box?.height).toBeGreaterThan(300)
      expect((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual(781)
    })
  }
}

test('mobile menu Escape behavior restores focus and scroll state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 })
  await openApp(page, '/en/about')
  const toggle = page.locator('button[aria-controls="mobile-nav"]')
  await toggle.focus()
  await toggle.click()
  await expect(page.locator('#mobile-nav')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-nav')).toBeHidden()
  await expect(toggle).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

for (const width of [320, 390] as const) {
  test(`home uses the authored mobile journey at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await openApp(page, '/en')

    const journey = page.locator('.mobile-home-journey')
    await expect(journey).toBeVisible()
    await expect(page.locator('.home-thread-canvas')).toBeHidden()
    await expect(journey.getByText('Saël', { exact: true })).toBeVisible()
    await expect(journey.getByText('Selected work', { exact: true }).first()).toBeVisible()
    await expect(page.locator('.mobile-command-bar')).toBeVisible()

    const projects = journey.locator('.mobile-home-project-link')
    expect(await projects.count()).toBeGreaterThanOrEqual(2)
    const geometry = await projects.evaluateAll((links) =>
      links.map((link) => {
        const rect = link.getBoundingClientRect()
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height }
      }),
    )
    geometry.forEach((item) => {
      expect(item.left).toBeGreaterThanOrEqual(-1)
      expect(item.right).toBeLessThanOrEqual(width + 1)
      expect(item.width).toBeGreaterThan(width * 0.9)
      expect(item.height).toBeGreaterThan(440)
    })
  })
}

for (const width of [768, 1023] as const) {
  test(`compact thread keeps a non-overlapping spatial composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await openApp(page, '/en')
    const nodes = page.locator('.thread-node')
    await expect(nodes.first().locator('.thread-disc')).toBeVisible()
    await expect(page.locator('.thread-track > canvas')).toBeHidden()
    expect(await nodes.locator('xpath=self::a[@href]').count()).toBeGreaterThan(0)

    const layout = await nodes.evaluateAll((items) => {
      const overlaps = (a: DOMRect, b: DOMRect) =>
        Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
        Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1

      return items.map((item) => {
        const rect = item.getBoundingClientRect()
        const blob = item.querySelector<HTMLElement>('.thread-blob')?.getBoundingClientRect()
        const heading = item.querySelector<HTMLElement>('.thread-heading')?.getBoundingClientRect()
        const inspect = item.querySelector<HTMLElement>('.thread-inspect')?.getBoundingClientRect()
        return {
          id: (item as HTMLElement).dataset.threadId,
          side: (item as HTMLElement).dataset.threadSide,
          position: getComputedStyle(item).position,
          top: rect.top,
          bottom: rect.bottom,
          discCenterX: blob ? blob.left + blob.width / 2 : 0,
          internalCollision: Boolean(
            blob && ((heading && overlaps(blob, heading)) || (inspect && overlaps(blob, inspect))),
          ),
        }
      })
    })
    for (const [index, item] of layout.entries()) {
      expect(item.position).toBe('relative')
      expect(item.side).toBe(index % 2 === 0 ? 'left' : 'right')
      expect(item.internalCollision, `${item.id} has overlapping thumbnail/copy regions`).toBe(false)
      if (index > 0) {
        expect(item.top).toBeGreaterThanOrEqual(layout[index - 1].bottom - 1)
        if (item.side === 'left') expect(item.discCenterX).toBeLessThan(layout[index - 1].discCenterX)
        else expect(item.discCenterX).toBeGreaterThan(layout[index - 1].discCenterX)
      }
    }

    const thread = page.locator('[data-mobile-thread-connectors]')
    await expect(thread).toBeVisible()
    await expect(thread).toHaveAttribute('aria-hidden', 'true')
    await expect.poll(() => thread.locator('[data-thread-connector][d]').count()).toBe(layout.length - 1)
    const connectors = await thread.locator('[data-thread-connector]').evaluateAll((paths) =>
      paths.map((path) => ({
        from: (path as SVGPathElement).dataset.from,
        to: (path as SVGPathElement).dataset.to,
        d: path.getAttribute('d'),
        pointerEvents: getComputedStyle(path).pointerEvents,
      })),
    )
    connectors.forEach((connector, index) => {
      expect(connector.from).toBe(layout[index].id)
      expect(connector.to).toBe(layout[index + 1].id)
      expect(connector.d).toMatch(/^M /)
      expect(connector.pointerEvents).toBe('none')
    })
  })
}

for (const width of [1024, 1025] as const) {
  test(`thread enables the enhanced canvas layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await openApp(page, '/en')
    const nodes = page.locator('.thread-node')
    await expect(nodes.first().locator('.thread-disc')).toBeVisible()
    await expect(page.locator('.thread-track > canvas')).toBeVisible()
    expect(await nodes.first().evaluate((item) => getComputedStyle(item).position)).toBe('absolute')
  })
}

test('focusable elements are not hidden with opacity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 })
  await openApp(page, '/en/work')
  await page.locator('.mobile-work-card').first().waitFor({ state: 'visible' })

  const hiddenFocusStops = await page.locator('a[href], button, input, textarea, select, [tabindex]').evaluateAll((items) =>
    items.flatMap((item) => {
      const element = item as HTMLElement
      const style = getComputedStyle(element)
      const hidden = Number.parseFloat(style.opacity) <= 0.01 || style.visibility === 'hidden'
      return hidden && element.tabIndex >= 0
        ? [{ tag: element.tagName, text: element.innerText?.trim().slice(0, 80), className: element.className }]
        : []
    }),
  )
  expect(hiddenFocusStops).toEqual([])
})
