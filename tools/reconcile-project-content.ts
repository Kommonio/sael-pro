import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'

import { textToLexical } from '../src/lib/richText'
import { projects } from '../src/seed/content'

const root = process.cwd()
const apply = process.argv.includes('--apply')
const target = (option('--target') || 'local') as 'local' | 'production'
const typographicHeroes = new Set([
  'echoes',
  'omega-protocol',
  'villa-hublot',
  'sensory-odyssey',
  'le-repaire',
])

function option(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function loadEnvironment() {
  if (target === 'production') {
    const result = dotenv.config({ path: path.resolve(root, '.env.production.local'), override: true })
    if (result.error) throw result.error
    process.env.NODE_ENV = 'production'
    process.env.PAYLOAD_DB_PUSH = 'false'
    delete process.env.PAYLOAD_FORCE_DRIZZLE_PUSH
    return
  }

  dotenv.config({ path: path.resolve(root, '.env'), override: true })
  dotenv.config({ path: path.resolve(root, '.env.local'), override: true })
  process.env.NODE_ENV = 'development'
  delete process.env.VERCEL
}

if (target !== 'local' && target !== 'production') throw new Error('--target must be local or production')
if (target === 'production' && apply && !process.argv.includes('--confirm-production')) {
  throw new Error('Production apply requires --confirm-production.')
}
loadEnvironment()

async function run() {
  console.table(
    projects.map((project) => ({
      slug: project.slug,
      en: project.title.en,
      fr: project.title.fr,
      hero: typographicHeroes.has(project.slug) ? 'typographic' : 'existing media',
      credits: project.credits.length,
    })),
  )
  if (!apply) {
    console.log(
      `Dry run only. Re-run with --target ${target} --apply${
        target === 'production' ? ' --confirm-production' : ''
      } to reconcile ${target} Payload content.`,
    )
    return
  }

  const { default: config } = await import('../src/payload.config')
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  try {
    if (target === 'production') {
      const [english, french] = await Promise.all([
        payload.find({
          collection: 'projects',
          locale: 'en',
          fallbackLocale: false,
          draft: true,
          depth: 2,
          limit: 100,
          overrideAccess: true,
        }),
        payload.find({
          collection: 'projects',
          locale: 'fr',
          fallbackLocale: false,
          draft: true,
          depth: 2,
          limit: 100,
          overrideAccess: true,
        }),
      ])
      const backupDir = path.resolve(root, 'tmp/wp-uploads-analysis')
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      await fs.mkdir(backupDir, { recursive: true })
      await fs.writeFile(
        path.join(backupDir, `production-before-content-reconcile-${stamp}.json`),
        JSON.stringify({ english: english.docs, french: french.docs }, null, 2),
      )
    }

    for (const project of projects) {
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: project.slug } },
        locale: 'en',
        fallbackLocale: false,
        draft: true,
        depth: 1,
        limit: 1,
        overrideAccess: true,
      })
      const current = existing.docs[0]
      if (!current) throw new Error(`Project not found: ${project.slug}`)

      const english = await payload.update({
        collection: 'projects',
        id: current.id,
        locale: 'en',
        draft: current._status === 'draft',
        depth: 1,
        overrideAccess: true,
        data: {
          title: project.title.en,
          role: project.role.en,
          client: 'client' in project ? project.client?.en : undefined,
          location: 'location' in project ? project.location?.en : undefined,
          lede: project.lede.en,
          question: project.question.en,
          experience: textToLexical(project.experience.en),
          system: textToLexical(project.system.en),
          whatChanged: textToLexical(project.whatChanged?.en || ''),
          credits: project.credits.map((credit) => ({
            name: credit.name,
            role: credit.role.en,
          })),
          verification: 'verified',
          ...(typographicHeroes.has(project.slug) ? { heroTreatment: 'typographic' as const } : {}),
        },
      })

      await payload.update({
        collection: 'projects',
        id: current.id,
        locale: 'fr',
        draft: current._status === 'draft',
        overrideAccess: true,
        data: {
          title: project.title.fr,
          role: project.role.fr,
          client: 'client' in project ? project.client?.fr : undefined,
          location: 'location' in project ? project.location?.fr : undefined,
          lede: project.lede.fr,
          question: project.question.fr,
          experience: textToLexical(project.experience.fr),
          system: textToLexical(project.system.fr),
          whatChanged: textToLexical(project.whatChanged?.fr || ''),
          credits: project.credits.map((credit, index) => ({
            name: credit.name,
            role: credit.role.fr,
            id: english.credits?.[index]?.id || undefined,
          })),
        },
      })

      console.log(`Reconciled ${project.slug} in EN and FR.`)
    }
  } finally {
    await payload.destroy()
  }
}

run().then(
  () => process.exit(0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
