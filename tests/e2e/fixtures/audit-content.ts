export const AUDIT_FIXTURE_VERSION = '2026-08-20.v1' as const

export const auditLocales = ['en', 'fr'] as const
export type AuditLocale = (typeof auditLocales)[number]
export type LocalizedText = Record<AuditLocale, string>

export const requiredFilterTags = [
  'authored',
  'systems',
  'interactive',
  'immersive',
  'software',
  'experiments',
] as const

export type AuditFilterTag = (typeof requiredFilterTags)[number]

type MediaFixture = {
  id: string
  src: string
  presentation: 'informative' | 'decorative'
  alt: Partial<LocalizedText>
  credit?: string
}

type HeroFixture =
  | { treatment: 'media'; media: MediaFixture }
  | { treatment: 'typographic'; media?: never }

export type ProjectAuditFixture = {
  slug: string
  year: string
  title: LocalizedText
  role: LocalizedText
  lede: LocalizedText
  tags: AuditFilterTag[]
  authorship: 'authored' | 'collaborative' | 'contribution'
  hero: HeroFixture
  editorialStatus: 'draft' | 'published'
  verification: 'pending' | 'verified'
  requiredLocalesComplete: boolean
  creditsComplete: boolean
  publicReady: boolean
}

const informativeHero = (
  id: string,
  src: string,
  alt: LocalizedText,
  credit: string,
): HeroFixture => ({
  treatment: 'media',
  media: { id, src, presentation: 'informative', alt, credit },
})

export const projectAuditFixtures: ProjectAuditFixture[] = [
  {
    slug: 'azul-vivo',
    year: '2026–',
    title: { en: 'Azul Vivo', fr: 'Azul Vivo' },
    role: { en: 'Creator & Director', fr: 'Créateur et réalisateur' },
    lede: {
      en: 'An immersive underwater documentary practice spanning 360° image, spatial sound, institutional VR and fulldome.',
      fr: 'Une pratique documentaire sous-marine immersive réunissant image 360°, son spatial, réalité virtuelle institutionnelle et fulldome.',
    },
    tags: ['authored', 'immersive', 'interactive'],
    authorship: 'authored',
    hero: informativeHero(
      'media-azul-vivo',
      '/fixtures/azul-vivo.jpg',
      {
        en: 'A diver observes a reef through an underwater 360-degree camera system',
        fr: 'Une plongeuse observe un récif avec un système de caméra sous-marine à 360 degrés',
      },
      'Saël Simard — Presence, Seaflower',
    ),
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'onmove',
    year: '2022–',
    title: { en: 'OnMove', fr: 'OnMove' },
    role: {
      en: 'Creator / Application & Platform Architect',
      fr: 'Créateur / architecte applicatif et plateforme',
    },
    lede: {
      en: 'A platform for creating, managing and delivering location-aware immersive media.',
      fr: 'Une plateforme pour créer, gérer et diffuser des médias immersifs sensibles au lieu.',
    },
    tags: ['authored', 'software', 'interactive'],
    authorship: 'authored',
    hero: informativeHero(
      'media-onmove',
      '/fixtures/onmove.jpg',
      {
        en: 'A Montréal street mapped as a location-aware media path',
        fr: 'Une rue de Montréal cartographiée comme parcours médiatique géolocalisé',
      },
      'OnMove field recon — Montréal',
    ),
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'echoes',
    year: '2023–2024',
    title: { en: 'Echoes', fr: 'Échos' },
    role: { en: 'Creator / System Architect', fr: 'Créateur / architecte système' },
    lede: {
      en: 'Biometric middleware that carries physiological signals through a realtime media pipeline.',
      fr: 'Un intergiciel biométrique qui transporte des signaux physiologiques dans une chaîne média temps réel.',
    },
    tags: ['authored', 'systems', 'interactive', 'software'],
    authorship: 'authored',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'man-who-planted-trees',
    year: '2025',
    title: { en: 'The Man Who Planted Trees', fr: "L'homme qui plantait des arbres" },
    role: {
      en: 'Technical Architecture Design — Supply + Demand',
      fr: 'Conception de l’architecture technique — Supply + Demand',
    },
    lede: {
      en: 'A touring immersive exhibition developed with the Canadian Museum of Nature.',
      fr: 'Une exposition immersive itinérante conçue avec le Musée canadien de la nature.',
    },
    tags: ['systems', 'immersive', 'interactive'],
    authorship: 'contribution',
    hero: informativeHero(
      'media-man-who-planted-trees',
      '/fixtures/man-who-planted-trees.jpg',
      {
        en: 'Visitors move through the forest-inspired immersive exhibition',
        fr: 'Des visiteurs parcourent l’exposition immersive inspirée de la forêt',
      },
      'Supply + Demand',
    ),
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'viventi-mori',
    year: '2018–2019',
    title: { en: 'Viventi Mori', fr: 'Viventi Mori' },
    role: {
      en: 'Physical system design and fabrication — collaborative creator',
      fr: 'Conception et fabrication du système physique — créateur collaborateur',
    },
    lede: {
      en: 'A portable projection-mapping object built around a skull and a suitcase.',
      fr: 'Un objet portatif de projection architecturale construit autour d’un crâne et d’une valise.',
    },
    tags: ['systems', 'immersive'],
    authorship: 'collaborative',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'omega-protocol',
    year: '2023',
    title: { en: 'Omega Protocol', fr: 'Protocole Oméga' },
    role: { en: 'Creator / Producer', fr: 'Créateur / producteur' },
    lede: {
      en: 'A multiplayer immersive VR game delivered at public-festival scale.',
      fr: 'Un jeu de réalité virtuelle immersive multijoueur livré à l’échelle d’un festival public.',
    },
    tags: ['authored', 'immersive', 'interactive', 'experiments'],
    authorship: 'authored',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'versus',
    year: '2022',
    title: { en: 'Versus', fr: 'Versus' },
    role: { en: 'Creator / Producer', fr: 'Créateur / producteur' },
    lede: {
      en: 'A multiplayer immersive VR experience in the same public-festival lineage.',
      fr: 'Une expérience de réalité virtuelle immersive multijoueur issue de la même lignée de festivals publics.',
    },
    tags: ['authored', 'immersive', 'interactive', 'experiments'],
    authorship: 'authored',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'villa-hublot',
    year: '2022',
    title: { en: 'Villa Hublot', fr: 'Villa Hublot' },
    role: { en: 'System Designer — Bakuza Events', fr: 'Concepteur système — Bakuza Events' },
    lede: {
      en: 'Interactive multimedia systems for a World Cup hospitality environment.',
      fr: 'Des systèmes multimédias interactifs pour un environnement d’hospitalité de la Coupe du monde.',
    },
    tags: ['systems', 'interactive'],
    authorship: 'contribution',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'sensory-odyssey',
    year: '2026',
    title: {
      en: 'Sensory Odyssey / Vivid',
      fr: 'Odyssée sensorielle / Vivid — une traversée multisensorielle des écosystèmes vivants',
    },
    role: { en: 'System Designer — Supply + Demand', fr: 'Concepteur système — Supply + Demand' },
    lede: {
      en: 'The North American deployment of a multisensory touring exhibition.',
      fr: 'Le déploiement nord-américain d’une exposition itinérante multisensorielle où projection, son, odeur, scénographie et avatars interactifs doivent demeurer lisibles, fiables et cohérents malgré une formulation volontairement longue.',
    },
    tags: ['systems', 'immersive', 'interactive'],
    authorship: 'contribution',
    hero: { treatment: 'typographic' },
    editorialStatus: 'published',
    verification: 'verified',
    requiredLocalesComplete: true,
    creditsComplete: true,
    publicReady: true,
  },
  {
    slug: 'le-repaire',
    year: '2026',
    title: { en: 'Le Repaire', fr: 'Le Repaire' },
    role: {
      en: 'System Designer / Integrator — Supply + Demand',
      fr: 'Concepteur système / intégrateur — Supply + Demand',
    },
    lede: {
      en: 'An intentionally unready record used to prove that draft work never enters public queries.',
      fr: 'Une fiche intentionnellement incomplète qui prouve qu’un brouillon ne rejoint jamais les requêtes publiques.',
    },
    tags: ['systems', 'interactive'],
    authorship: 'contribution',
    hero: { treatment: 'typographic' },
    editorialStatus: 'draft',
    verification: 'pending',
    requiredLocalesComplete: true,
    creditsComplete: false,
    publicReady: false,
  },
]

export const decorativeMediaFixture: MediaFixture = {
  id: 'media-decorative-thread-texture',
  src: '/fixtures/thread-texture.png',
  presentation: 'decorative',
  alt: { en: '', fr: '' },
}

export const invalidMissingAltMediaFixture: MediaFixture = {
  id: 'media-invalid-missing-fr-alt',
  src: '/fixtures/invalid-missing-alt.jpg',
  presentation: 'informative',
  alt: { en: 'A deliberately invalid media fixture without a French alternative' },
}

export const aboutAuditFixture = {
  title: { en: 'About Saël', fr: 'À propos de Saël' },
  phases: {
    en: [
      { title: 'Image', body: 'Cinematography and the image as material.' },
      { title: 'Systems', body: 'Interactive environments and touring systems.' },
    ],
    fr: [
      { title: 'Image', body: 'La cinématographie et l’image comme matière.' },
      { title: 'Systèmes', body: 'Des environnements interactifs et des systèmes itinérants.' },
    ],
  },
  education: {
    en: [{ place: 'UQAM', detail: 'Cinematography', years: '2008–2011' }],
    fr: [{ place: 'UQAM', detail: 'Cinématographie', years: '2008–2011' }],
  },
} as const

export const contactAuditScenarios = {
  success: {
    response: { status: 200, body: { ok: true } },
    expected: {
      en: 'Received. I will write back.',
      fr: 'Reçu. Je vous écrirai.',
    },
  },
  httpError: {
    response: { status: 503, body: { error: 'Fixture service unavailable' } },
    expected: {
      en: 'Something went wrong. Write me directly.',
      fr: 'Un problème est survenu. Écrivez-moi directement.',
    },
  },
  networkError: {
    response: { abort: 'failed' as const },
    expected: {
      en: 'Something went wrong. Write me directly.',
      fr: 'Un problème est survenu. Écrivez-moi directement.',
    },
  },
} as const

export function derivePublicReadiness(project: ProjectAuditFixture) {
  return (
    project.editorialStatus === 'published' &&
    project.verification === 'verified' &&
    project.requiredLocalesComplete &&
    project.creditsComplete &&
    (project.hero.treatment === 'typographic' || Boolean(project.hero.media))
  )
}
