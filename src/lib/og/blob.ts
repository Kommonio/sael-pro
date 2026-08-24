import { createHash } from 'node:crypto'

import { list, put } from '@vercel/blob'

import { OG_RENDER_VERSION } from './constants'
import type { OgDescriptor } from './descriptor'
import { renderOgPng } from './render'

function safeKey(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-/]+|[-/]+$/g, '')
    .toLowerCase()
}

export function ogBlobPath(descriptor: OgDescriptor) {
  const contentHash = createHash('sha256')
    .update(JSON.stringify({ version: OG_RENDER_VERSION, ...descriptor }))
    .digest('hex')
    .slice(0, 12)
  return `og/${OG_RENDER_VERSION}/${descriptor.locale}/${safeKey(descriptor.key) || 'home'}-${contentHash}.png`
}

export async function getOrCreateOgBlob(descriptor: OgDescriptor) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required to render and persist OG images.')

  const pathname = ogBlobPath(descriptor)
  const existing = await list({ token, prefix: pathname, limit: 1 })
  const exact = existing.blobs.find((blob) => blob.pathname === pathname)
  if (exact) return { url: exact.url, pathname, created: false }

  const png = await renderOgPng(descriptor)
  const uploaded = await put(pathname, png, {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'image/png',
  })
  return { url: uploaded.url, pathname, created: true }
}
