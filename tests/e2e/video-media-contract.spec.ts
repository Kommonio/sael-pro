import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { Media } from '../../src/collections/Media'
import {
  externalVideoEmbedUrl,
  normalizeProjectVideos,
  parseExternalVideo,
  validateExternalVideoUrl,
} from '../../src/lib/videoMedia'

test.describe('video media contract', () => {
  test('accepts direct video uploads in the Blob-backed media library', () => {
    expect(typeof Media.upload).toBe('object')
    if (!Media.upload || typeof Media.upload !== 'object') return
    expect(Media.upload.mimeTypes).toEqual(
      expect.arrayContaining([
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-m4v',
        'text/vtt',
      ]),
    )
  })

  test('exposes upload, Vimeo, and YouTube sources on projects', () => {
    const schema = readFileSync(resolve(process.cwd(), 'src/collections/Projects.ts'), 'utf8')
    expect(schema).toContain("name: 'videos'")
    expect(schema).toContain("value: 'upload'")
    expect(schema).toContain("value: 'vimeo'")
    expect(schema).toContain("value: 'youtube'")
    expect(schema).toContain('validateProjectVideoUrl')
  })

  test('parses common YouTube URLs and emits a no-cookie player URL', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ?t=40',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
    ]) {
      expect(parseExternalVideo('youtube', url)).toMatchObject({
        provider: 'youtube',
        id: 'dQw4w9WgXcQ',
      })
      expect(validateExternalVideoUrl('youtube', url)).toBe(true)
    }
    expect(externalVideoEmbedUrl('youtube', 'https://youtu.be/dQw4w9WgXcQ', 90)).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&start=90',
    )
  })

  test('preserves Vimeo unlisted hashes and enables do-not-track', () => {
    expect(parseExternalVideo('vimeo', 'https://vimeo.com/76979871/a1b2c3')).toEqual({
      provider: 'vimeo',
      id: '76979871',
      hash: 'a1b2c3',
    })
    expect(externalVideoEmbedUrl('vimeo', 'https://vimeo.com/76979871/a1b2c3', 12)).toBe(
      'https://player.vimeo.com/video/76979871?dnt=1&h=a1b2c3#t=12s',
    )
  })

  test('rejects arbitrary iframe hosts and provider mismatches', () => {
    expect(parseExternalVideo('youtube', 'https://example.com/embed/dQw4w9WgXcQ')).toBeNull()
    expect(parseExternalVideo('vimeo', 'https://youtu.be/dQw4w9WgXcQ')).toBeNull()
    expect(parseExternalVideo('youtube', 'javascript:alert(1)')).toBeNull()
    expect(validateExternalVideoUrl('youtube', 'https://vimeo.com/76979871')).not.toBe(true)
  })

  test('keeps the legacy uploaded-video field readable during migration', () => {
    expect(
      normalizeProjectVideos({
        title: 'Legacy case',
        video: { url: 'https://example.public.blob.vercel-storage.com/case.mp4' },
      }),
    ).toMatchObject([
      {
        source: 'upload',
        title: 'Legacy case',
        id: 'legacy-video',
      },
    ])
  })

  test('normalizes Blob-hosted WebVTT tracks for uploaded video', () => {
    const [video] = normalizeProjectVideos({
      title: 'Captioned case',
      videos: [
        {
          source: 'upload',
          asset: { url: 'https://example.public.blob.vercel-storage.com/case.mp4' },
          title: 'A captioned film',
          tracks: [
            {
              file: { url: 'https://example.public.blob.vercel-storage.com/case-en.vtt' },
              language: 'en',
              label: 'English',
              default: true,
            },
          ],
        },
      ],
    })
    expect(video.tracks).toMatchObject([
      { language: 'en', label: 'English', kind: 'captions', default: true },
    ])
  })

  test('ships an additive production migration instead of rebuilding existing content tables', () => {
    const migration = readFileSync(
      resolve(process.cwd(), 'src/migrations/20260821_170237_video_media.ts'),
      'utf8',
    )
    const payloadConfig = readFileSync(resolve(process.cwd(), 'src/payload.config.ts'), 'utf8')
    expect(migration).toContain('CREATE TABLE "projects_videos"')
    expect(migration).toContain('CREATE TABLE "_projects_v_version_videos"')
    expect(migration).toContain('ALTER TYPE "public"."enum_media_kind" ADD VALUE')
    expect(migration).not.toContain('CREATE TABLE "projects" (')
    expect(migration).not.toContain('CREATE TABLE "media" (')
    expect(payloadConfig).toContain('prodMigrations: migrations')
  })
})
