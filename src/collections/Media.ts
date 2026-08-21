import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { projectLexical } from '@/fields/richText'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'kind', 'alt', 'credit', 'updatedAt'],
    description:
      'Site images, videos, and WebVTT caption tracks stored on Vercel Blob. Photographer / studio credit is required when the asset is not Saël’s own.',
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      editor: projectLexical,
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer, studio, or rights holder. Rendered on the site.',
      },
    },
    {
      name: 'creditUrl',
      type: 'text',
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (from file type)', value: 'auto' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Diagram', value: 'diagram' },
        { label: 'Caption track (WebVTT)', value: 'captions' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'purpose',
      type: 'select',
      options: [
        { label: 'Informative — describe it', value: 'informative' },
        { label: 'Decorative — empty alt text', value: 'decorative' },
      ],
      admin: {
        description:
          'Required before project media is publicly ready. Informative assets need localized alt text; decorative assets must use empty alt text.',
        position: 'sidebar',
      },
    },
    {
      name: 'rightsConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Confirm that this site may publicly display the asset.',
        position: 'sidebar',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.kind === 'video' ||
          (typeof siblingData?.mimeType === 'string' && siblingData.mimeType.includes('video')),
      },
    },
    {
      name: 'blobPath',
      type: 'text',
      admin: {
        description: 'Stable Vercel Blob key (set by blob-ingest).',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: [
      'image/*',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-m4v',
      'text/vtt',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
      { name: 'xlarge', width: 1920 },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
  },
}
