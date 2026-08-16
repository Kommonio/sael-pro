import type { GlobalConfig } from 'payload'

import { projectLexical } from '@/fields/richText'
import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Practice: GlobalConfig = {
  slug: 'practice',
  label: 'Practice',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', type: 'richText', localized: true, editor: projectLexical },
      ],
    },
  ],
}
