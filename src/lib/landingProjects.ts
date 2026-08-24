export type LandingPosition = 'primary' | 'secondary'

export type LandingProject = {
  slug: string
  landingPosition?: LandingPosition | null
}

export function resolveLandingProjects<T extends LandingProject>(projects: readonly T[]) {
  const primary = projects.find((project) => project.landingPosition === 'primary') || null
  const secondary = projects.find((project) => project.landingPosition === 'secondary') || null
  const spotlight = [primary, secondary].filter((project): project is T => Boolean(project))
  const spotlightSlugs = new Set(spotlight.map((project) => project.slug))

  return {
    primary,
    secondary,
    spotlight,
    remaining: projects.filter((project) => !spotlightSlugs.has(project.slug)),
  }
}
