import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || '').trim()

export const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: Boolean(blobToken),
    clientUploads: true,
    collections: {
      media: {
        prefix: 'cms-media',
      },
    },
    token: blobToken || 'vercel_blob_token_placeholder',
  }),
  seoPlugin({
    collections: ['projects', 'pages'],
    uploadsCollection: 'media',
    generateTitle: ({ doc }) => (doc?.title ? `${doc.title} — Saël Simard` : 'Saël Simard'),
    generateURL: ({ doc, collectionSlug }) => {
      const url = getServerSideURL()
      if (!doc?.slug) return url
      if (collectionSlug === 'projects') return `${url}/en/work/${doc.slug}`
      return `${url}/en/${doc.slug}`
    },
  }),
  redirectsPlugin({
    collections: ['pages', 'projects'],
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        group: 'Inbox',
      },
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Inbox',
      },
    },
  }),
]
