import { expect, test } from '@playwright/test'

import {
  aboutAuditFixture,
  auditLocales,
  contactAuditScenarios,
  decorativeMediaFixture,
  derivePublicReadiness,
  invalidMissingAltMediaFixture,
  projectAuditFixtures,
  requiredFilterTags,
} from './fixtures/audit-content'

test.describe('deterministic UX fixture contract', () => {
  test('contains the ten audited projects with stable, unique slugs', () => {
    expect(projectAuditFixtures).toHaveLength(10)
    expect(new Set(projectAuditFixtures.map(({ slug }) => slug)).size).toBe(10)
    expect(projectAuditFixtures.map(({ slug }) => slug).sort()).toEqual(
      [
        'azul-vivo',
        'echoes',
        'le-repaire',
        'man-who-planted-trees',
        'omega-protocol',
        'onmove',
        'sensory-odyssey',
        'versus',
        'villa-hublot',
        'viventi-mori',
      ].sort(),
    )
  })

  test('covers every filter and both hero treatments', () => {
    const tags = new Set(projectAuditFixtures.flatMap(({ tags }) => tags))
    for (const tag of requiredFilterTags) expect(tags.has(tag), `Missing ${tag} fixture`).toBe(true)
    expect(projectAuditFixtures.some(({ hero }) => hero.treatment === 'media')).toBe(true)
    expect(projectAuditFixtures.some(({ hero }) => hero.treatment === 'typographic')).toBe(true)
  })

  test('keeps EN/FR project and About structures complete', () => {
    for (const project of projectAuditFixtures) {
      for (const locale of auditLocales) {
        expect(project.title[locale].trim()).not.toBe('')
        expect(project.role[locale].trim()).not.toBe('')
        expect(project.lede[locale].trim()).not.toBe('')
      }
    }
    expect(projectAuditFixtures.find(({ slug }) => slug === 'sensory-odyssey')?.lede.fr.length).toBeGreaterThan(180)
    expect(aboutAuditFixture.phases.en).toHaveLength(aboutAuditFixture.phases.fr.length)
    expect(aboutAuditFixture.education.en).toHaveLength(aboutAuditFixture.education.fr.length)
  })

  test('represents informative, decorative, and invalid missing-alt media', () => {
    const mediaHeroes = projectAuditFixtures.flatMap(({ hero }) =>
      hero.treatment === 'media' ? [hero.media] : [],
    )
    for (const media of mediaHeroes) {
      expect(media.presentation).toBe('informative')
      expect(media.alt.en?.trim()).not.toBe('')
      expect(media.alt.fr?.trim()).not.toBe('')
    }
    expect(decorativeMediaFixture.presentation).toBe('decorative')
    expect(decorativeMediaFixture.alt).toEqual({ en: '', fr: '' })
    expect(invalidMissingAltMediaFixture.presentation).toBe('informative')
    expect(invalidMissingAltMediaFixture.alt.fr).toBeUndefined()
  })

  test('derives verified and intentionally unready public states', () => {
    for (const project of projectAuditFixtures) {
      expect(project.publicReady, `${project.slug} has a stale readiness flag`).toBe(
        derivePublicReadiness(project),
      )
    }
    expect(projectAuditFixtures.some(({ publicReady }) => publicReady)).toBe(true)
    expect(projectAuditFixtures.some(({ publicReady }) => !publicReady)).toBe(true)
  })

  test('defines Contact success, HTTP failure, and network failure in both locales', () => {
    expect(Object.keys(contactAuditScenarios)).toEqual(['success', 'httpError', 'networkError'])
    for (const fixture of Object.values(contactAuditScenarios)) {
      expect(fixture.expected.en.trim()).not.toBe('')
      expect(fixture.expected.fr.trim()).not.toBe('')
    }
  })
})
