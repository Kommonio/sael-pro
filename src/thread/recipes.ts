import type { ProjectCardData } from '@/components/ProjectCard'
import { matchesFilter } from '@/components/score/shared'
import type { Locale } from '@/i18n/config'
import { ABOUT_STILL, CONTACT_STILL, coverFor, PORTRAIT, SECTION } from '@/lib/covers'
import { sortByRecency } from '@/lib/catalog'
import { t } from '@/lib/copy'
import { mediaUrl } from '@/lib/media'

import { thread, type CompiledGraph } from './graph'
import { v } from './math'

function projectNode(project: ProjectCardData, locale: Locale, extra?: { kind?: 'disc' | 'ring' | 'night'; weight?: 'spine' | 'branch' | 'hairline' }) {
  const cover = coverFor(project.slug)
  const hero = typeof project.hero === 'object' ? project.hero : null
  const heroURL = mediaUrl(hero, 'xlarge') || mediaUrl(hero)
  return {
    id: project.slug,
    label: project.title,
    meta: [project.year, project.studio || (project.authorship === 'authored' ? (locale === 'fr' ? 'Auteur' : 'Authored') : project.role)].filter(Boolean).join(' · '),
    href: `/${locale}/work/${project.slug}`,
    still: heroURL || cover?.src,
    credit: hero?.credit || cover?.credit,
    detail: project.lede,
    enter: locale === 'fr' ? 'Entrer' : 'Enter',
    kind: extra?.kind || 'disc',
    weight: extra?.weight || (project.authorship === 'authored' ? 'spine' : 'branch'),
  } as const
}

export function homeGraph(
  locale: Locale,
  thesis: string,
  projects: ProjectCardData[],
  lab: { slug: string; title: string; year?: string | null; url?: string | null; lede?: string | null }[],
): CompiledGraph {
  const labels = t(locale)
  const featured = projects.find((project) => project.landingPosition === 'primary') || projects[0]
  const featuredHero = typeof featured?.hero === 'object' ? featured.hero : null
  const workCover = coverFor(featured?.slug)
  const workStill = mediaUrl(featuredHero, 'xlarge') || mediaUrl(featuredHero) || workCover?.src
  const enter = locale === 'fr' ? 'Entrer' : 'Enter'
  const viewWork = locale === 'fr' ? 'Voir une sélection de projets' : 'View selected work'
  const viewCase = locale === 'fr' ? 'Voir l’étude de cas' : 'View case study'
  const fr = locale === 'fr'
  const line = thread({ width: 1000 }).from('mark').curveTo(v(300, 200), 0.4)
  line.node({
    id: 'sael',
    label: 'Saël Simard',
    meta: fr ? 'Architecte de systèmes · Technologue créatif' : 'System Architect · Creative Technologist',
    detail: thesis,
    still: PORTRAIT.src,
    credit: PORTRAIT.credit,
    href: `/${locale}/work`,
    enter: viewWork,
    weight: 'spine',
  })
  line.curveTo(v(580, 400), 0.36).loop(50, Math.PI * 1.15)
  line.curveTo(v(390, 620), 0.28).node({
    id: 'work',
    label: featured?.title || labels.work,
    meta: featured
      ? [featured.role, featured.year].filter(Boolean).join(' · ')
      : fr
        ? 'Œuvre choisie'
        : 'Selected work',
    detail:
      featured?.lede ||
      (fr
        ? 'Images, logiciels, systèmes et espaces — le travail, avec ses crédits honnêtes.'
        : 'Images, software, systems and space — the work, with honest credits.'),
    href: featured ? `/${locale}/work/${featured.slug}` : `/${locale}/work`,
    still: workStill,
    credit: featuredHero?.credit || workCover?.credit,
    enter: featured ? viewCase : enter,
    weight: 'spine',
  })
  line.split((arm) => {
    arm(-1)
      .curveTo(v(200, 870), 0.34)
      .node({
        id: 'practice',
        label: labels.practice,
        meta: fr ? 'Grammaire' : 'Grammar',
        detail: fr
          ? 'Comment une chose devient inévitable. Ce n’est pas une page de services.'
          : 'How a thing becomes inevitable. This is not a services page.',
        href: `/${locale}/practice`,
        still: SECTION.practice.src,
        credit: SECTION.practice.credit,
        enter,
        kind: 'ring',
        weight: 'branch',
      })
    arm(1)
      .curveTo(v(800, 870), 0.32)
      .node({
        id: 'lab',
        label: labels.lab,
        meta: fr ? 'Expériences' : 'Experiments',
        detail:
          lab[0]?.lede ||
          (fr ? 'Essais légers. Des outils, pas des salles vides.' : 'Lightweight trials. Tools, not empty rooms.'),
        href: `/${locale}/lab`,
        still: SECTION.lab.src,
        credit: SECTION.lab.credit,
        enter,
        kind: 'night',
        weight: 'branch',
      })
  })
  line.curveTo(v(500, 1120), 0.24).node({
    id: 'about',
    label: labels.about,
    meta: 'Montréal',
    detail: fr
      ? 'Architecte de systèmes chez Supply + Demand. Pratique indépendante via Kommon.io depuis 2017.'
      : 'System Architect at Supply + Demand. Independent practice as Kommon.io since 2017.',
    href: `/${locale}/about`,
    still: ABOUT_STILL.src,
    credit: ABOUT_STILL.credit,
    enter,
    weight: 'spine',
  })
  line.curveTo(v(300, 1360), 0.22).node({
    id: 'contact',
    label: labels.contact,
    meta: fr ? 'Correspondance' : 'Correspondence',
    detail: fr ? 'Un message direct, sans détour.' : 'A direct message, without ceremony.',
    href: `/${locale}/contact`,
    still: CONTACT_STILL.src,
    credit: CONTACT_STILL.credit,
    enter,
    kind: 'disc',
    weight: 'hairline',
  })
  return line.compile()
}

function look(project: ProjectCardData) {
  if (project.authorship === 'collaborative') return { kind: 'ring' as const, weight: 'branch' as const }
  if (project.authorship === 'contribution') return { kind: 'night' as const, weight: 'hairline' as const }
  return { kind: 'disc' as const, weight: 'spine' as const }
}

export function workGraph(locale: Locale, projects: ProjectCardData[], filter = 'all'): CompiledGraph {
  const ordered = sortByRecency(projects.filter((project) => matchesFilter(project, filter)))
  const t = thread({ width: 1000 }).from(v(120, 110))
  const first = ordered[0]
  if (!first) return t.compile()

  t.curveTo(v(380, 300), 0.22).node(projectNode(first, locale, look(first)))

  let y = 560
  for (let i = 1; i < ordered.length; ) {
    const a = ordered[i]
    const b = ordered[i + 1]
    if (b) {
      t.split((arm) => {
        arm(-1)
          .weight(look(a).weight)
          .curveTo(v(220, y), 0.34)
          .node(projectNode(a, locale, look(a)))
        arm(1)
          .weight(look(b).weight)
          .curveTo(v(800, y + 16), 0.32)
          .node(projectNode(b, locale, look(b)))
      })
      y += 300
      t.curveTo(v(500, y - 70), 0.22)
      i += 2
    } else {
      t.curveTo(v(i % 2 ? 700 : 300, y), 0.26).node(projectNode(a, locale, look(a)))
      i += 1
    }
  }
  return t.compile()
}

export function labGraph(
  locale: Locale,
  items: { slug: string; title: string; year?: string | null; url?: string | null; lede?: string }[],
): CompiledGraph {
  const t = thread({ width: 1000 }).from(v(200, 80)).curveTo(v(540, 240), 0.36)
  t.node({
    id: 'lab',
    label: locale === 'fr' ? 'Laboratoire' : 'Lab',
    meta: locale === 'fr' ? 'Expériences' : 'Experiments',
    still: SECTION.lab.src,
    credit: SECTION.lab.credit,
    weight: 'spine',
  })
  t.split((arm) => {
    items.forEach((item, i) => {
      arm(i % 2 ? 1 : -1)
        .weight('branch')
        .curveTo(v(i % 2 ? 780 : 220, 520 + i * 220), 0.4)
        .node({
          id: item.slug,
          label: item.title,
          meta: item.year || '',
          detail: item.lede,
          href: item.url || undefined,
          weight: 'branch',
        })
    })
  })
  return t.compile()
}

export function contactGraph(locale: Locale, title: string): CompiledGraph {
  return thread({ width: 1000 })
    .from(v(220, 80))
    .curveTo(v(560, 260), 0.4)
    .loop(44, Math.PI * 1.1)
    .curveTo(v(400, 520), 0.24)
    .node({
      id: 'contact',
      label: title,
      meta: locale === 'fr' ? 'Correspondance' : 'Correspondence',
      still: CONTACT_STILL.src,
      credit: CONTACT_STILL.credit,
      href: 'mailto:hello@sael.pro',
      weight: 'spine',
    })
    .compile()
}
