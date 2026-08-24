import type { Locale } from '@/i18n/config'
import { catalogCaseStudy } from '@/lib/caseStudies'
import { coverFor } from '@/lib/covers'
import { mediaUrl, type MediaDoc } from '@/lib/media'
import { getProject } from '@/lib/payload'
import { getPublicSiteURL } from '@/utilities/getPublicSiteURL'

import { OG_SOURCE_BLOB_URL } from './constants'

export type OgDescriptor = {
  key: string
  locale: Locale
  kind: 'site' | 'section' | 'case-study'
  eyebrow: string
  title: string
  description: string
  pathLabel: string
  imageUrl: string
  imageAlt: string
  role?: string | null
  revision?: string | null
}

const COPY: Record<Locale, Record<string, Omit<OgDescriptor, 'key' | 'locale' | 'imageUrl' | 'imageAlt'>>> = {
  en: {
    home: {
      kind: 'site',
      eyebrow: 'SYSTEM ARCHITECT · CREATIVE TECHNOLOGIST',
      title: 'Saël Simard',
      description: 'Images, software, systems and space — designed as one encounter.',
      pathLabel: 'SAEL.PRO',
    },
    work: {
      kind: 'section',
      eyebrow: 'THE FULL FIELD',
      title: 'Selected work',
      description: 'Authored worlds, spatial systems, immersive media and the infrastructure that holds them together.',
      pathLabel: 'SAEL.PRO / WORK',
    },
    about: {
      kind: 'section',
      eyebrow: 'ABOUT THE PRACTICE',
      title: 'Complex simplicity',
      description: 'A multidisciplinary practice moving between image-making, software, systems and physical space.',
      pathLabel: 'SAEL.PRO / ABOUT',
    },
    practice: {
      kind: 'section',
      eyebrow: 'FORM · EXPERIENCE · PURPOSE',
      title: 'The practice',
      description: 'The method behind work that must hold technically, spatially and emotionally.',
      pathLabel: 'SAEL.PRO / PRACTICE',
    },
    lab: {
      kind: 'section',
      eyebrow: 'OPEN QUESTIONS · WORKING SYSTEMS',
      title: 'Lab',
      description: 'Small utilities and live experiments: precise tools made to test an idea in the real.',
      pathLabel: 'SAEL.PRO / LAB',
    },
    contact: {
      kind: 'section',
      eyebrow: 'MONTRÉAL · AVAILABLE WORLDWIDE',
      title: 'Start a conversation',
      description: 'For collaborations, systems, installations and work that has to hold in the real.',
      pathLabel: 'SAEL.PRO / CONTACT',
    },
  },
  fr: {
    home: {
      kind: 'site',
      eyebrow: 'ARCHITECTE SYSTÈME · TECHNOLOGUE CRÉATIF',
      title: 'Saël Simard',
      description: 'Images, logiciels, systèmes et espaces — conçus comme une seule rencontre.',
      pathLabel: 'SAEL.PRO',
    },
    work: {
      kind: 'section',
      eyebrow: 'LE CHAMP COMPLET',
      title: 'Œuvres choisies',
      description: 'Mondes d’auteur, systèmes spatiaux, médias immersifs et l’infrastructure qui les fait tenir.',
      pathLabel: 'SAEL.PRO / ŒUVRE',
    },
    about: {
      kind: 'section',
      eyebrow: 'À PROPOS DE LA PRATIQUE',
      title: 'Simplicité complexe',
      description: 'Une pratique multidisciplinaire entre image, logiciel, systèmes et espace physique.',
      pathLabel: 'SAEL.PRO / À PROPOS',
    },
    practice: {
      kind: 'section',
      eyebrow: 'FORME · EXPÉRIENCE · PROPOS',
      title: 'La pratique',
      description: 'La méthode derrière un travail qui doit tenir techniquement, spatialement et émotionnellement.',
      pathLabel: 'SAEL.PRO / PRATIQUE',
    },
    lab: {
      kind: 'section',
      eyebrow: 'QUESTIONS OUVERTES · SYSTÈMES EN TRAVAIL',
      title: 'Lab',
      description: 'Petits outils et expériences vivantes : des systèmes précis pour éprouver une idée dans le réel.',
      pathLabel: 'SAEL.PRO / LAB',
    },
    contact: {
      kind: 'section',
      eyebrow: 'MONTRÉAL · DISPONIBLE PARTOUT',
      title: 'Commençons une conversation',
      description: 'Pour des collaborations, des systèmes, des installations et un travail qui doit tenir dans le réel.',
      pathLabel: 'SAEL.PRO / CONTACT',
    },
  },
}

function absoluteMediaUrl(url: string | null | undefined) {
  if (!url) return null
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  return new URL(url.startsWith('/') ? url : `/${url}`, getPublicSiteURL()).toString()
}

function staticDescriptor(locale: Locale, page: string): OgDescriptor | null {
  const copy = COPY[locale][page]
  if (!copy) return null
  return {
    ...copy,
    key: page,
    locale,
    imageUrl: OG_SOURCE_BLOB_URL,
    imageAlt: 'A warm editorial material study of textured paper, brass filament and smoked glass',
  }
}

export async function resolveOgDescriptor(locale: Locale, rawPath: string[] = []): Promise<OgDescriptor | null> {
  const path = rawPath.filter(Boolean).map((part) => part.toLowerCase())
  if (path.length === 0) return staticDescriptor(locale, 'home')
  if (path.length === 1) return staticDescriptor(locale, path[0])
  if (path.length !== 2 || path[0] !== 'work') return null

  const slug = path[1]
  const cms = await getProject(slug, locale)
  const project = cms || catalogCaseStudy(slug, locale)
  if (!project) return null

  const cmsImage = cms && typeof cms.hero === 'object' ? mediaUrl(cms.hero as MediaDoc, 'og') || mediaUrl(cms.hero as MediaDoc) : null
  const cover = coverFor(slug)
  const projectImage = absoluteMediaUrl(cmsImage || cover?.src) || OG_SOURCE_BLOB_URL
  const authorship = project.authorship === 'contribution' ? (locale === 'fr' ? 'CONTRIBUTION' : 'CONTRIBUTED WORK') : locale === 'fr' ? 'ŒUVRE D’AUTEUR' : 'AUTHORED WORK'

  return {
    key: `work/${slug}`,
    locale,
    kind: 'case-study',
    eyebrow: authorship,
    title: project.title,
    description: project.lede,
    pathLabel: `SAEL.PRO / WORK / ${slug.replaceAll('-', ' ').toUpperCase()}`,
    imageUrl: projectImage,
    imageAlt: cover?.alt || `${project.title} project image`,
    role: project.role,
    revision: cms?.updatedAt || null,
  }
}
