import { readdirSync, renameSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const dir = join(process.cwd(), 'public', 'stills')
const files = readdirSync(dir).filter((name) => /\.(png|jpe?g|webp)$/i.test(name) && !name.endsWith('.tmp.jpg'))

for (const name of files) {
  const input = join(dir, name)
  const outName = name.replace(/\.png$/i, '.jpg').replace(/\.webp$/i, '.jpg')
  const tmp = join(dir, `${outName}.tmp`)
  await sharp(input)
    .rotate()
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(tmp)
  const output = join(dir, outName)
  renameSync(tmp, output)
  if (input !== output) unlinkSync(input)
  console.log(outName, statSync(output).size)
}
