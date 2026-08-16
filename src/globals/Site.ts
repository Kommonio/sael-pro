import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Site',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'name', type: 'text', defaultValue: 'Saël Simard' },
    { name: 'thesis', type: 'textarea', localized: true },
    { name: 'locationLine', type: 'text', localized: true, defaultValue: 'Montréal' },
    { name: 'email', type: 'email' },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'seoTitle', type: 'text', localized: true },
    { name: 'seoDescription', type: 'textarea', localized: true },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
