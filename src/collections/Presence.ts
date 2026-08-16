import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'

export const Presence: CollectionConfig = {
  slug: 'presence',
  admin: {
    hidden: true,
    useAsTitle: 'sessionId',
  },
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: () => false,
  },
  fields: [
    { name: 'sessionId', type: 'text', required: true, index: true },
    { name: 'lastSeen', type: 'date', required: true },
  ],
}
