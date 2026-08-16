import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateLab } from '@/hooks/revalidateContent'

export const LabItems: CollectionConfig = {
  slug: 'lab-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'updatedAt'],
    group: 'Content',
    description: 'Small shipped experiments. Keep them small.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'year', type: 'text' },
    { name: 'lede', type: 'textarea', localized: true, required: true },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'Public URL only. Never a private hostname.' },
    },
    { name: 'media', type: 'upload', relationTo: 'media' },
  ],
  hooks: {
    afterChange: [revalidateLab],
  },
}
