import 'dotenv/config'

import { put } from '@vercel/blob'
import { getPayload } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import config from '../src/payload.config'

type ManifestEntry = {
  file: string
  blobPath: string
  url: string
  mediaId: string | number
}

function arg(name: string, fallback?: string) {
  const index = process.argv.indexOf(name)
  if (index === -1) return fallback
  return process.argv[index + 1] || fallback
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(resolved)
      return [resolved]
    }),
  )
  return files.flat().filter((file) => /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i.test(file))
}

async function run() {
  const dir = path.resolve(arg('--dir', './content/media') || './content/media')
  const prefix = (arg('--prefix', 'projects') || 'projects').replace(/^\/|\/$/g, '')
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required. Create a Vercel Blob store first.')
  }

  const files = await walk(dir)
  if (!files.length) {
    console.log(`No media found in ${dir}`)
    process.exit(0)
  }

  const payload = await getPayload({ config })
  const manifest: ManifestEntry[] = []

  for (const file of files) {
    const relative = path.relative(dir, file).replaceAll('\\', '/')
    const blobPath = `${prefix}/${relative}`
    const buffer = await fs.readFile(file)
    const uploaded = await put(blobPath, buffer, {
      access: 'public',
      token,
      addRandomSuffix: false,
    })

    const existing = await payload.find({
      collection: 'media',
      where: { blobPath: { equals: blobPath } },
      limit: 1,
      overrideAccess: true,
    })

    const data = {
      alt: path.parse(file).name.replace(/[-_]/g, ' '),
      blobPath,
      url: uploaded.url,
      filename: path.basename(file),
    }

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'media',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'media',
          data,
          overrideAccess: true,
        })

    manifest.push({
      file: relative,
      blobPath,
      url: uploaded.url,
      mediaId: doc.id,
    })
    console.log(`ingested ${relative} → ${doc.id}`)
  }

  const out = path.resolve('content/media-manifest.json')
  await fs.writeFile(out, JSON.stringify(manifest, null, 2))
  console.log(`Wrote ${out}`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
