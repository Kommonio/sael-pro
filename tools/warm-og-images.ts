import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { locales } = await import('../src/i18n/config')
const { catalogProjectCards } = await import('../src/lib/catalog')
const { getOrCreateOgBlob } = await import('../src/lib/og/blob')
const { OG_STATIC_PATHS } = await import('../src/lib/og/constants')
const { resolveOgDescriptor } = await import('../src/lib/og/descriptor')

let created = 0
let reused = 0

for (const locale of locales) {
  const paths: string[][] = [
    ...OG_STATIC_PATHS.map((path) => (path ? [path] : [])),
    ...catalogProjectCards(locale).map((project) => ['work', project.slug]),
  ]

  for (const path of paths) {
    const descriptor = await resolveOgDescriptor(locale, path)
    if (!descriptor) throw new Error(`No OG descriptor for /${locale}/${path.join('/')}`)
    const result = await getOrCreateOgBlob(descriptor)
    if (result.created) created += 1
    else reused += 1
    console.log(`${result.created ? 'created' : 'reused '} /${locale}/${path.join('/')} -> ${result.url}`)
  }
}

console.log(`OG Blob warm complete: ${created} created, ${reused} reused.`)
