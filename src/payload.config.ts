import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { LabItems } from './collections/LabItems'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Presence } from './collections/Presence'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { defaultLexical } from './fields/defaultLexical'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Home } from './globals/Home'
import { Practice } from './globals/Practice'
import { Site } from './globals/Site'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '— sael.pro',
      description: 'Saël Simard — site administration',
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: (() => {
    const url = process.env.DATABASE_URL || 'file:./saelpro.db'
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
      return postgresAdapter({
        pool: { connectionString: url },
        push:
          process.env.PAYLOAD_DB_PUSH === 'false'
            ? false
            : process.env.NODE_ENV !== 'production' ||
              process.env.PAYLOAD_FORCE_DRIZZLE_PUSH === 'true',
      })
    }
    return sqliteAdapter({
      client: { url },
    })
  })(),
  collections: [Projects, LabItems, Pages, Media, Presence, Users],
  globals: [Site, Home, Practice, About, Header, Footer, Contact],
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: [
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' },
    ],
  },
  cors: [getServerSideURL()].filter(Boolean),
  plugins,
  secret:
    process.env.PAYLOAD_SECRET ||
    (process.env.NEXT_PHASE === 'phase-production-build'
      ? 'build-time-placeholder-set-PAYLOAD_SECRET-in-vercel'
      : ''),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
