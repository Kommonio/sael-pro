import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    {
      name: 'nav',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'topologyLabel', type: 'text', localized: true, defaultValue: 'Score' },
  ],
}
