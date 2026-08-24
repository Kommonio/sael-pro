import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, test } from '@playwright/test'

import { landingPositionField } from '../../src/fields/landingPosition'
import { resolveLandingProjects } from '../../src/lib/landingProjects'

test.describe('home landing project contract', () => {
  test('Payload exposes one unique editorial slot for Primary and Secondary', () => {
    expect(landingPositionField).toMatchObject({
      name: 'landingPosition',
      type: 'select',
      unique: true,
      index: true,
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
    })
  })

  test('selection follows Payload positions without relying on project slugs', () => {
    const projects = [
      { slug: 'third', landingPosition: null },
      { slug: 'arbitrary-secondary', landingPosition: 'secondary' as const },
      { slug: 'arbitrary-primary', landingPosition: 'primary' as const },
      { slug: 'fourth', landingPosition: null },
    ]

    const result = resolveLandingProjects(projects)

    expect(result.primary?.slug).toBe('arbitrary-primary')
    expect(result.secondary?.slug).toBe('arbitrary-secondary')
    expect(result.spotlight.map((project) => project.slug)).toEqual([
      'arbitrary-primary',
      'arbitrary-secondary',
    ])
    expect(result.remaining.map((project) => project.slug)).toEqual(['third', 'fourth'])
  })

  test('migration backfills the two current positions and enforces database uniqueness', () => {
    const migration = readFileSync(
      resolve(process.cwd(), 'src/migrations/20260824_133157_home_landing_positions.ts'),
      'utf8',
    )

    expect(migration).toContain(`WHERE "slug" = 'azul-vivo'`)
    expect(migration).toContain(`WHERE "slug" = 'onmove'`)
    expect(migration).toContain('CREATE UNIQUE INDEX "projects_landing_position_idx"')
  })

  test('mobile orbit variants stay unframed and mobile routes skip the page bridge', () => {
    const orbit = readFileSync(resolve(process.cwd(), 'src/components/MobileLabOrbit.tsx'), 'utf8')
    const styles = readFileSync(resolve(process.cwd(), 'src/app/(frontend)/globals.css'), 'utf8')
    const clock = readFileSync(resolve(process.cwd(), 'src/thread/clock.ts'), 'utf8')
    const bridge = readFileSync(resolve(process.cwd(), 'src/components/ThreadBridge.tsx'), 'utf8')

    expect(orbit).not.toContain('mobile-home-orbit-thread-tail')
    expect(styles).toMatch(/\.mobile-home-orbit\s*\{[\s\S]*?border:\s*0;[\s\S]*?border-radius:\s*0;/)
    expect(styles).toMatch(/\.mobile-home-work-orbit\s*\{[\s\S]*?background:\s*transparent;/)
    expect(styles).toMatch(/\.mobile-home-lab-orbit\s*\{[\s\S]*?background:\s*[\s\S]*?var\(--night\)\);/)
    expect(clock).toContain('(max-width: 767.98px), (prefers-reduced-motion: reduce)')
    expect(bridge).toContain('reducedThreadTravel()')
  })
})
