import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { projectLexical } from '@/fields/richText'
import { revalidateProject } from '@/hooks/revalidateContent'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'authorship', 'tier', 'verification', 'updatedAt'],
    group: 'Content',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    year: true,
    role: true,
    studio: true,
    client: true,
    authorship: true,
    tier: true,
    lede: true,
    tags: true,
    hero: true,
    climateHint: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Exact, honest credit. Visible above the fold.',
      },
    },
    {
      name: 'studio',
      type: 'text',
    },
    {
      name: 'client',
      type: 'text',
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
    },
    {
      name: 'authorship',
      type: 'select',
      required: true,
      defaultValue: 'authored',
      options: [
        { label: 'Authored', value: 'authored' },
        { label: 'Collaborative', value: 'collaborative' },
        { label: 'Contribution', value: 'contribution' },
        { label: 'Experiment', value: 'experiment' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'a',
      options: [
        { label: 'A — Signature', value: 'a' },
        { label: 'B — Professional contribution', value: 'b' },
        { label: 'C — Lab', value: 'c' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOrder',
      type: 'number',
      admin: { position: 'sidebar', condition: (_, sibling) => Boolean(sibling?.featured) },
    },
    {
      name: 'verification',
      type: 'select',
      defaultValue: 'needs-copy',
      options: [
        { label: 'Verified', value: 'verified' },
        { label: 'Needs media', value: 'needs-media' },
        { label: 'Needs copy', value: 'needs-copy' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'climateHint',
      type: 'select',
      defaultValue: 'earth',
      options: [
        { label: 'Earth / ochre', value: 'earth' },
        { label: 'Sap / cool green', value: 'sap' },
        { label: 'Clay / warm', value: 'clay' },
        { label: 'Moss / systems', value: 'moss' },
        { label: 'Acid / lab', value: 'acid' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How The Condition retunes the chromatic climate when this work is attended.',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Authored', value: 'authored' },
        { label: 'Systems', value: 'systems' },
        { label: 'Interactive', value: 'interactive' },
        { label: 'Immersive', value: 'immersive' },
        { label: 'Software', value: 'software' },
        { label: 'Experiments', value: 'experiments' },
      ],
    },
    {
      name: 'lede',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'question',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'experience',
      type: 'richText',
      localized: true,
      editor: projectLexical,
    },
    {
      name: 'system',
      type: 'richText',
      localized: true,
      editor: projectLexical,
    },
    {
      name: 'whatChanged',
      type: 'richText',
      localized: true,
      editor: projectLexical,
    },
    {
      name: 'technologies',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Sparse. Only tools that explain capability on this project.',
      },
    },
    {
      name: 'credits',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Public project site if any. Never a private/internal hostname.',
      },
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'diagram',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateProject],
  },
  versions: {
    drafts: true,
  },
}
