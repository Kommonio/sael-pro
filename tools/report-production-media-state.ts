import process from 'node:process'

import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.production.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env.production.local')
}

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  const migrations = await client.query('select id, name, batch from payload_migrations order by id')
  const media = await client.query('select count(*)::int as count from media')
  const targetProjects = await client.query(
    'select count(*)::int as count from projects where slug = any($1::varchar[])',
    [['viventi-mori', 'versus']],
  )
  const videoTable = await client.query(
    "select to_regclass('public.projects_videos')::text as projects_videos",
  )
  const contractColumns = await client.query(`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and (
        (table_name = 'projects' and column_name = 'hero_treatment')
        or (table_name = 'media' and column_name in ('purpose', 'rights_confirmed'))
      )
    order by table_name, column_name
  `)

  console.log(
    JSON.stringify(
      {
        migrations: migrations.rows,
        media: media.rows[0]?.count,
        targetProjects: targetProjects.rows[0]?.count,
        tables: videoTable.rows[0],
        contractColumns: contractColumns.rows,
      },
      null,
      2,
    ),
  )
} finally {
  await client.end()
}
