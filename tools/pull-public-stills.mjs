import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const out = join(process.cwd(), 'public', 'work')
mkdirSync(out, { recursive: true })

const targets = [
  { file: 'azul-vivo.jpg', urls: ['https://azulvivo.com/media/azul/STILL1.png'] },
  { file: 'azul-vivo-2.jpg', urls: ['https://azulvivo.com/media/azul/STILL2.png'] },
  { file: 'azul-vivo-3.jpg', urls: ['https://azulvivo.com/media/azul/STILL3.png'] },
  { file: 'azul-vivo-4.jpg', urls: ['https://azulvivo.com/media/azul/STILL4.png'] },
  { file: 'azul-vivo-vr.jpg', urls: ['https://azulvivo.com/media/azul/vr-gen-web.jpg'] },
  {
    file: 'man-who-planted-trees.jpg',
    urls: [
      'https://supply-demand.ca/sites/default/files/project/image/97/15-biodiversitynsv00725.jpg',
      'https://supply-demand.ca/sites/default/files/styles/fixed_width_480/public/project/image/97/15-biodiversitynsv00725.jpg?itok=WdNQsWqH',
    ],
  },
  {
    file: 'sael-portrait.jpg',
    urls: [
      'https://supply-demand.ca/sites/default/files/team/image/69/sael-eliossimard-savard1532x1532.jpg',
      'https://supply-demand.ca/sites/default/files/styles/fixed_width_480/public/team/image/69/sael-eliossimard-savard1532x1532.jpg?itok=9C8B4Ysy',
    ],
  },
  {
    file: 'viventi-mori.gif',
    urls: [
      'https://www.alexvlair.com/wp-content/uploads/2018/06/ViveLatinoHANDTEST.gif',
    ],
  },
]

async function firstOk(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'sael.pro media pull' } })
      const type = res.headers.get('content-type') || ''
      if (res.ok && type.startsWith('image/')) {
        return { buffer: Buffer.from(await res.arrayBuffer()), type, url }
      }
      console.log('skip', url, res.status, type)
    } catch (error) {
      console.log('fail', url, error.message)
    }
  }
  return null
}

for (const target of targets) {
  const hit = await firstOk(target.urls)
  if (!hit) {
    console.log('MISSING', target.slug)
    continue
  }
  const dest = join(out, target.file)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, hit.buffer)
  console.log('ok', target.slug, hit.url, hit.buffer.length)
}
