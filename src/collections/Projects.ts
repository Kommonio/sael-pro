import type { CollectionConfig, TextFieldSingleValidation, UploadFieldSingleValidation } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { landingPositionField } from '@/fields/landingPosition'
import { projectLexical } from '@/fields/richText'
import { revalidateProject } from '@/hooks/revalidateContent'
import { validateExternalVideoUrl, type VideoSourceType } from '@/lib/videoMedia'

function videoSourceFromSibling(siblingData: unknown): VideoSourceType | undefined {
  if (!siblingData || typeof siblingData !== 'object' || !('source' in siblingData)) return undefined
  const source = siblingData.source
  return source === 'upload' || source === 'vimeo' || source === 'youtube' ? source : undefined
}

const validateProjectVideoAsset: UploadFieldSingleValidation = (value, { siblingData }) => {
  if (videoSourceFromSibling(siblingData) !== 'upload') return true
  return value ? true : 'Choose or upload a video file.'
}

const validateProjectVideoUrl: TextFieldSingleValidation = (value, { siblingData }) => {
  const source = videoSourceFromSibling(siblingData)
  if (source !== 'vimeo' && source !== 'youtube') return true
  return validateExternalVideoUrl(source, value)
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'landingPosition', 'year', 'authorship', 'tier', 'verification', 'updatedAt'],
    description:
      'Case-study-grade Work only. Small utilities and lightweight prototypes belong in Lab Items. Publishing and factual verification are separate states.',
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
    videos: true,
    climateHint: true,
    landingPosition: true,
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
        { label: 'Experiment — case-study grade', value: 'experiment' },
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
        { label: 'C — Verified Work experiment', value: 'c' },
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
    landingPositionField,
    {
      name: 'verification',
      type: 'select',
      defaultValue: 'needs-copy',
      options: [
        { label: 'Verified', value: 'verified' },
        { label: 'Needs media', value: 'needs-media' },
        { label: 'Needs copy', value: 'needs-copy' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Factual/content review, independent of draft/published status. “Verified” alone does not guarantee public readiness.',
      },
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
        { label: 'Experiments — Work case study', value: 'experiments' },
      ],
      admin: {
        description: 'Small utilities belong in Lab Items, not the Work collection.',
      },
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
      name: 'heroTreatment',
      label: 'Hero treatment',
      type: 'select',
      options: [
        { label: 'Media — approved hero asset', value: 'media' },
        { label: 'Typographic — intentional no-media hero', value: 'typographic' },
      ],
      admin: {
        description:
          'An explicit editorial decision. Choose Media only when the approved hero below is populated.',
        position: 'sidebar',
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
      filterOptions: {
        mimeType: { contains: 'video/' },
      },
      admin: {
        description:
          'Legacy single uploaded video. Existing records remain supported; use “Video media” below for new work.',
      },
    },
    {
      name: 'videos',
      label: 'Video media',
      type: 'array',
      labels: {
        singular: 'Video',
        plural: 'Videos',
      },
      admin: {
        description:
          'Add a Blob-hosted upload, Vimeo player, or YouTube player. Entries are rendered in this order on the case study.',
      },
      fields: [
        {
          name: 'source',
          label: 'Source',
          type: 'select',
          required: true,
          defaultValue: 'upload',
          options: [
            { label: 'Upload — Vercel Blob', value: 'upload' },
            { label: 'Vimeo embed', value: 'vimeo' },
            { label: 'YouTube embed', value: 'youtube' },
          ],
        },
        {
          name: 'asset',
          label: 'Uploaded video',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: { contains: 'video/' },
          },
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'upload',
            description:
              'Choose an existing video or upload MP4, WebM, MOV, or M4V. New files upload directly to Vercel Blob.',
          },
          validate: validateProjectVideoAsset,
        },
        {
          name: 'url',
          label: 'Video URL or ID',
          type: 'text',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === 'vimeo' || siblingData?.source === 'youtube',
            description:
              'Paste the public Vimeo or YouTube URL. Player URLs are generated from a strict provider allowlist.',
          },
          validate: validateProjectVideoUrl,
        },
        {
          name: 'title',
          label: 'Accessible title',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            description: 'Names the player for visitors and assistive technology.',
          },
        },
        {
          name: 'caption',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: { contains: 'image/' },
          },
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'upload',
            description:
              'Optional image shown before an uploaded video plays. The video asset’s own poster is used as fallback.',
          },
        },
        {
          name: 'tracks',
          label: 'Captions and subtitles',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'upload',
            description:
              'Optional WebVTT tracks for uploaded video. Add every language available in the recording.',
          },
          fields: [
            {
              name: 'file',
              label: 'WebVTT file',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: {
                mimeType: { equals: 'text/vtt' },
              },
            },
            {
              name: 'kind',
              type: 'select',
              required: true,
              defaultValue: 'captions',
              options: [
                { label: 'Captions', value: 'captions' },
                { label: 'Subtitles', value: 'subtitles' },
              ],
            },
            {
              name: 'language',
              label: 'Language',
              type: 'select',
              required: true,
              options: [
                { label: 'English', value: 'en' },
                { label: 'Français', value: 'fr' },
              ],
            },
            {
              name: 'label',
              label: 'Player label',
              type: 'text',
              required: true,
              admin: {
                description: 'For example “English” or “Français”.',
              },
            },
            {
              name: 'default',
              label: 'Default track',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'startAt',
          label: 'Start at (seconds)',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === 'vimeo' || siblingData?.source === 'youtube',
          },
        },
        {
          name: 'aspectRatio',
          label: 'Frame ratio',
          type: 'select',
          required: true,
          defaultValue: '16:9',
          options: [
            { label: 'Landscape — 16:9', value: '16:9' },
            { label: 'Classic — 4:3', value: '4:3' },
            { label: 'Square — 1:1', value: '1:1' },
            { label: 'Portrait — 9:16', value: '9:16' },
          ],
        },
      ],
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
