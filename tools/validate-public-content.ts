import fs from 'node:fs/promises'
import path from 'node:path'

import { chromium, type APIRequestContext, type Page } from 'playwright'

type Locale = 'en' | 'fr'
type Failure = { route: string; field: string; detail: string }
type Credit = { name?: string | null; role?: string | null }
type Project = {
  slug?: string | null
  title?: string | null
  role?: string | null
  lede?: string | null
  question?: string | null
  experience?: unknown
  system?: unknown
  whatChanged?: unknown
  credits?: Credit[] | null
  verification?: string | null
  heroTreatment?: 'media' | 'typographic' | null
  hero?: unknown
}

const baseURL = (process.env.CONTENT_VALIDATION_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const locales: Locale[] = ['en', 'fr']
const outputFile = path.resolve(process.cwd(), 'tmp/wp-uploads-analysis/public-content-validation.json')
const internalNote =
  /secret secret|to be recovered|remain(?:s)? for confirmation|pending archive|should be recovered|missing individual credits|not listed on the studio.?s public post/i

function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function lexicalText(value: unknown): string {
  const fragments: string[] = []
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    if (typeof record.text === 'string') fragments.push(record.text)
    for (const [key, child] of Object.entries(record)) {
      if (key !== 'text') visit(child)
    }
  }
  visit(value)
  return normalize(fragments.join(' '))
}

async function projectsFor(request: APIRequestContext, locale: Locale) {
  const response = await request.get(
    `${baseURL}/api/projects?limit=100&depth=2&locale=${locale}&fallback-locale=none&sort=slug`,
  )
  if (!response.ok()) throw new Error(`Project API ${locale}: HTTP ${response.status()}`)
  const body = (await response.json()) as { docs?: Project[] }
  return body.docs || []
}

function fail(failures: Failure[], route: string, field: string, detail: string) {
  failures.push({ route, field, detail })
}

function requireText(failures: Failure[], route: string, field: string, value?: string | null) {
  if (!normalize(value || '')) fail(failures, route, field, 'Missing localized content')
}

async function validateGeneralPage(page: Page, route: string, failures: Failure[]) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForTimeout(250)
  if (!response || response.status() >= 400) {
    fail(failures, route, 'document', `HTTP ${response?.status() || 'no response'}`)
    return
  }
  const locale = route.split('/')[1]
  const lang = await page.locator('html').getAttribute('lang')
  const h1s = await page.locator('h1').count()
  const mainText = normalize((await page.locator('main').textContent()) || '')
  if (lang !== locale) fail(failures, route, 'lang', `Expected ${locale}, received ${lang || 'empty'}`)
  if (h1s !== 1) fail(failures, route, 'h1', `Expected exactly one H1, received ${h1s}`)
  if (mainText.length < 40) fail(failures, route, 'main', `Only ${mainText.length} visible text characters`)
  if (internalNote.test(mainText)) fail(failures, route, 'editorial', 'Internal research note is visible')
}

async function validateProjectPage(
  page: Page,
  locale: Locale,
  project: Project,
  failures: Failure[],
) {
  const route = `/${locale}/work/${project.slug}`
  await validateGeneralPage(page, route, failures)
  const mainText = normalize((await page.locator('main').textContent()) || '')
  const h1 = normalize((await page.locator('h1').textContent()) || '')
  if (h1 !== normalize(project.title || '')) {
    fail(failures, route, 'title', `Rendered “${h1}”; CMS says “${project.title || ''}”`)
  }

  const expected = [
    ['role', project.role || ''],
    ['lede', project.lede || ''],
    ['question', project.question || ''],
    ['experience', lexicalText(project.experience)],
    ['system', lexicalText(project.system)],
    ['whatChanged', lexicalText(project.whatChanged)],
  ] as const
  for (const [field, value] of expected) {
    const snippet = normalize(value).slice(0, 70)
    if (snippet && !mainText.includes(snippet)) {
      fail(failures, route, field, `Localized copy is not rendered: “${snippet}…”`)
    }
  }
  for (const [index, credit] of (project.credits || []).entries()) {
    if (credit.name && !mainText.includes(normalize(credit.name))) {
      fail(failures, route, `credits.${index}.name`, `Missing “${credit.name}”`)
    }
    if (credit.role && !mainText.includes(normalize(credit.role))) {
      fail(failures, route, `credits.${index}.role`, `Missing “${credit.role}”`)
    }
  }

  const treatment = await page.locator('[data-hero-treatment]').getAttribute('data-hero-treatment')
  if (treatment !== project.heroTreatment) {
    fail(failures, route, 'heroTreatment', `Rendered ${treatment}; CMS says ${project.heroTreatment}`)
  }
  if (project.heroTreatment === 'media' && (await page.locator('.case-hero img, .case-hero video').count()) < 1) {
    fail(failures, route, 'hero', 'Media hero has no rendered image or video')
  }
  if (project.heroTreatment === 'typographic') {
    const field = page.locator('.case-experience-field')
    if ((await field.count()) !== 1) {
      fail(failures, route, 'experienceField', 'Intentional typographic evidence field is missing')
    } else {
      const fieldText = normalize(await field.innerText()).toLocaleLowerCase(locale)
      if (!fieldText.includes(normalize(project.title).toLocaleLowerCase(locale))) {
        fail(failures, route, 'experienceField.title', `Full project title is missing: “${project.title}”`)
      }
      if (!fieldText.includes(normalize(project.role).toLocaleLowerCase(locale))) {
        fail(failures, route, 'experienceField.role', `Exact project role is missing: “${project.role}”`)
      }
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await page.addInitScript({ content: 'globalThis.__name = (target) => target' })
  const failures: Failure[] = []
  const byLocale = new Map<Locale, Project[]>()

  try {
    for (const locale of locales) {
      const projects = await projectsFor(context.request, locale)
      byLocale.set(locale, projects)
      if (projects.length !== 10) fail(failures, `/${locale}/work`, 'projects', `Expected 10, received ${projects.length}`)

      for (const project of projects) {
        const route = `/${locale}/work/${project.slug || 'missing-slug'}`
        requireText(failures, route, 'slug', project.slug)
        requireText(failures, route, 'title', project.title)
        requireText(failures, route, 'role', project.role)
        requireText(failures, route, 'lede', project.lede)
        requireText(failures, route, 'question', project.question)
        requireText(failures, route, 'experience', lexicalText(project.experience))
        requireText(failures, route, 'system', lexicalText(project.system))
        requireText(failures, route, 'whatChanged', lexicalText(project.whatChanged))
        if (project.verification !== 'verified') {
          fail(failures, route, 'verification', `Expected verified, received ${project.verification || 'empty'}`)
        }
        if (project.heroTreatment !== 'media' && project.heroTreatment !== 'typographic') {
          fail(failures, route, 'heroTreatment', 'No explicit editorial hero decision')
        }
        if (project.heroTreatment === 'media' && !project.hero) fail(failures, route, 'hero', 'Media treatment has no hero')
        if (!(project.credits || []).length) fail(failures, route, 'credits', 'No credits')
        for (const [index, credit] of (project.credits || []).entries()) {
          requireText(failures, route, `credits.${index}.name`, credit.name)
          requireText(failures, route, `credits.${index}.role`, credit.role)
        }
        const allCopy = [
          project.title,
          project.role,
          project.lede,
          project.question,
          lexicalText(project.experience),
          lexicalText(project.system),
          lexicalText(project.whatChanged),
        ].join(' ')
        if (internalNote.test(allCopy)) fail(failures, route, 'editorial', 'Internal research note remains in CMS copy')

        if (project.slug) await validateProjectPage(page, locale, project, failures)
      }

      for (const pathName of ['', '/work', '/practice', '/lab', '/about', '/contact']) {
        const route = `/${locale}${pathName}`
        await validateGeneralPage(page, route, failures)
        if (pathName === '/practice' && (await page.locator('h2').count()) < 4) {
          fail(failures, route, 'sections', 'Practice needs at least four scannable sections')
        }
        if (pathName === '/about' && (await page.locator('h2').count()) < 6) {
          fail(failures, route, 'sections', 'About is missing phases, domains, or education')
        }
        if (pathName === '/lab' && (await page.locator('main a[href^="http"]').count()) < 1) {
          fail(failures, route, 'links', 'Lab has no explicit external project destinations')
        }
        if (pathName === '/contact' && (await page.locator('form').count()) !== 1) {
          fail(failures, route, 'form', 'Contact form is missing')
        }
      }
    }

    const en = new Map((byLocale.get('en') || []).map((project) => [project.slug, project]))
    const fr = new Map((byLocale.get('fr') || []).map((project) => [project.slug, project]))
    for (const [slug, english] of en) {
      const french = fr.get(slug)
      if (!french) {
        fail(failures, `/fr/work/${slug}`, 'locale', 'French project record is missing')
        continue
      }
      for (const field of ['lede', 'question'] as const) {
        if (normalize(english[field] || '') === normalize(french[field] || '')) {
          fail(failures, `/fr/work/${slug}`, field, 'French copy is identical to English')
        }
      }
      for (const field of ['experience', 'system', 'whatChanged'] as const) {
        if (lexicalText(english[field]) === lexicalText(french[field])) {
          fail(failures, `/fr/work/${slug}`, field, 'French rich text is identical to English')
        }
      }
    }
  } finally {
    await browser.close()
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseURL,
    locales,
    projects: byLocale.get('en')?.length || 0,
    routes: locales.length * ((byLocale.get('en')?.length || 0) + 6),
    failures,
  }
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ ...report, report: outputFile }, null, 2))
  if (failures.length) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
