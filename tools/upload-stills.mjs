import { put } from '@vercel/blob'
import { config } from 'dotenv'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

config({ path: '.env.local' })

const dir = join(process.cwd(), 'public', 'stills')
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  throw new Error('BLOB_READ_WRITE_TOKEN missing')
}

const map = {}
for (const name of readdirSync(dir)) {
  if (!/\.(png|jpe?g|webp|gif)$/i.test(name)) continue
  const uploaded = await put(`stills/${name}`, readFileSync(join(dir, name)), {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  map[name] = uploaded.url
  console.log(name, uploaded.url)
}

writeFileSync(join(process.cwd(), 'src/lib/still-urls.json'), JSON.stringify(map, null, 2))
console.log('wrote src/lib/still-urls.json')
