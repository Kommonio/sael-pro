import type { GlobalConfig } from 'payload'

import { projectLexical } from '@/fields/richText'
import { revalidateGlobals } from '@/hooks/revalidateContent'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobals] },
  fields: [
    { name: 'heroLine', type: 'textarea', localized: true },
    { name: 'heroName', type: 'text', defaultValue: 'Saël Simard' },
    {
      name: 'featured',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    { name: 'practiceTitle', type: 'text', localized: true },
    { name: 'practiceBody', type: 'richText', localized: true, editor: projectLexical },
    {
      name: 'practiceSteps',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    { name: 'contributionsTitle', type: 'text', localized: true },
    { name: 'contributionsIntro', type: 'textarea', localized: true },
    { name: 'labTitle', type: 'text', localized: true },
    { name: 'closeLine', type: 'textarea', localized: true },
  ],
}
