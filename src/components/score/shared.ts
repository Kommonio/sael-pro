import type { ProjectCardData } from '@/components/ProjectCard'
import type { ClimateHint } from '@/condition/types'

export function climateOf(project: ProjectCardData): ClimateHint {
  const hint = project.climateHint
  if (hint === 'sap' || hint === 'clay' || hint === 'moss' || hint === 'acid' || hint === 'earth') return hint
  return 'earth'
}

export const FILTER_TAGS: Record<string, string[]> = {
  'azul-vivo': ['authored', 'immersive'],
  'man-who-planted-trees': ['systems'],
  onmove: ['authored', 'software', 'interactive'],
  'omega-protocol': ['authored', 'immersive', 'interactive'],
  versus: ['authored', 'immersive', 'interactive'],
  'viventi-mori': ['experiments', 'interactive'],
  echoes: ['authored', 'systems', 'interactive'],
  'villa-hublot': ['systems', 'interactive'],
  'sensory-odyssey': ['systems'],
  'le-repaire': ['systems', 'interactive'],
}

export function matchesFilter(project: ProjectCardData, filter: string) {
  if (filter === 'all') return true
  if (project.authorship === filter) return true
  const tags = project.tags?.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
  if (tags?.length) return tags.includes(filter)
  return FILTER_TAGS[project.slug]?.includes(filter) || false
}
