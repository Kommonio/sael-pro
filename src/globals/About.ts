import type { GlobalConfig } from 'payload'

import { projectLexical } from '@/fields/richText'
import { revalidateGlobals } from '@/hooks/revalidateContent'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText', localized: true, editor: projectLexical },
    { name: 'currentRole', type: 'textarea', localized: true },
    {
      name: 'phases',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text', localized: true, required: true },
        { name: 'note', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        { name: 'place', type: 'text', required: true },
        { name: 'detail', type: 'text', localized: true },
        { name: 'years', type: 'text' },
      ],
    },
  ],
}
