import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'email', type: 'email' },
    { name: 'availability', type: 'textarea', localized: true },
    { name: 'submitLabel', type: 'text', localized: true },
    { name: 'successMessage', type: 'textarea', localized: true },
  ],
}
