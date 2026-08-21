import assert from 'node:assert/strict'

import {
  derivePublicProjectReadiness,
  normalizePublicProjectTags,
  publicReadyProjects,
  toPublicProjectView,
  type LocalizedProjectSources,
  type PublicProjectMediaSource,
  type PublicProjectSource,
} from '../src/lib/publicProjects'

function source(locale: 'en' | 'fr', overrides: Partial<PublicProjectSource> = {}): PublicProjectSource {
  return {
    id: 1,
    slug: 'complete-project',
    title: locale === 'fr' ? 'Projet complet' : 'Complete project',
    year: '2026',
    role: locale === 'fr' ? 'Créateur' : 'Creator',
    authorship: 'authored',
    tier: 'a',
    featured: true,
    featuredOrder: 1,
    verification: 'verified',
    climateHint: 'sap',
    tags: ['Interactive', ' systems ', 'interactive', 'not-a-public-tag'],
    lede: locale === 'fr' ? 'Une étude de cas complète.' : 'A complete case study.',
    question: locale === 'fr' ? 'Quelle question ?' : 'What question?',
    experience: locale === 'fr' ? 'Une expérience.' : 'An experience.',
    system: locale === 'fr' ? 'Un système.' : 'A system.',
    technologies: ['TypeScript'],
    credits: [{ name: 'Saël Simard', role: locale === 'fr' ? 'Créateur' : 'Creator' }],
    heroTreatment: 'typographic',
    _status: 'published',
    ...overrides,
  }
}

function pair(overrides: Partial<Record<'en' | 'fr', Partial<PublicProjectSource>>> = {}): LocalizedProjectSources {
  return {
    en: source('en', overrides.en),
    fr: source('fr', overrides.fr),
  }
}

function codes(sources: LocalizedProjectSources) {
  return new Set(derivePublicProjectReadiness(sources).issues.map((issue) => issue.code))
}

const typographic = pair()
const typographicView = toPublicProjectView(typographic, 'en')
assert(typographicView)
assert.equal(typographicView.readiness.isPublic, true)
assert.deepEqual(typographicView.tags, ['systems', 'interactive'])
assert.equal(typographicView.tier, 'a')
assert.equal(typographicView.authorship, 'authored')
assert.equal(typographicView.featuredOrder, 1)
assert.deepEqual(typographicView.credits, [{ name: 'Saël Simard', role: 'Creator' }])

assert.deepEqual(
  normalizePublicProjectTags([' interactive ', 'AUTHORED', 'interactive', 'unknown']),
  ['authored', 'interactive'],
)

const hero = (alt: string): PublicProjectMediaSource => ({
  id: 10,
  url: '/media/hero.jpg',
  alt,
  credit: 'Saël Simard',
  purpose: 'informative',
  rightsConfirmed: true,
  focalX: 125,
  focalY: -5,
})
const media = pair({
  en: { heroTreatment: 'media', hero: hero('An underwater reef') },
  fr: { heroTreatment: 'media', hero: hero('Un récif sous-marin') },
})
const mediaView = toPublicProjectView(media, 'fr')
assert(mediaView)
assert.equal(mediaView.readiness.isPublic, true)
assert.equal(mediaView.hero?.alt, 'Un récif sous-marin')
assert.equal(mediaView.hero?.focalPoint.css, '100% 0%')

assert(codes(pair({ en: { heroTreatment: null }, fr: { heroTreatment: null } })).has('hero-treatment-missing'))
assert(codes(pair({ en: { verification: 'needs-media' } })).has('not-verified'))
assert(codes({ en: source('en') }).has('locale-missing'))
assert(
  codes(
    pair({
      en: { heroTreatment: 'media', hero: hero('An underwater reef') },
      fr: { heroTreatment: 'media', hero: hero('') },
    }),
  ).has('informative-alt-missing'),
)
assert(codes(pair({ en: { system: 'Precise hardware remains for confirmation.' } })).has('internal-editorial-note'))
assert(
  codes(
    pair({
      en: { authorship: 'experiment', tier: 'c', tags: ['experiments'], question: '' },
      fr: { authorship: 'experiment', tier: 'c', tags: ['experiments'], question: '' },
    }),
  ).has('experiment-case-study-incomplete'),
)
assert(
  codes(pair({ en: { authorship: 'experiment', tier: 'c' }, fr: { authorship: 'experiment', tier: 'c' } })).has(
    'experiment-taxonomy-mismatch',
  ),
)

const unreadyView = toPublicProjectView(pair({ en: { verification: 'needs-copy' } }), 'en')
assert.deepEqual(publicReadyProjects([typographicView, unreadyView, null]).map((view) => view.slug), ['complete-project'])

console.log('Public project contract checks passed (11 readiness and normalization scenarios).')
