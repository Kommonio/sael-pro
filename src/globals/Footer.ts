import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'note', type: 'textarea', localized: true },
    { name: 'contactLabel', type: 'text', localized: true },
  ],
}
