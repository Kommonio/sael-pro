import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'
import type { Payload } from 'payload'

import type { Media, Project } from '../src/payload-types'
import { textToLexical } from '../src/lib/richText'

type LocaleText = { en: string; fr: string }
type Target = 'local' | 'production'

type ArchiveAsset = {
  key:
    | 'viventiHero'
    | 'viventiInstallation'
    | 'viventiFilm'
    | 'versusHero'
    | 'versusPlan'
    | 'azulHero'
    | 'azulReef'
    | 'azulShark'
    | 'azulOpenWater'
    | 'treesHero'
    | 'onmoveHero'
    | 'practiceProcess'
    | 'labFabrication'
  source: string
  filename: string
  mimeType: string
  kind: 'image' | 'video' | 'diagram'
  alt: LocaleText
  credit: string
  focalX?: number
  focalY?: number
}

const root = process.cwd()
const analysisDir = path.resolve(root, 'tmp/wp-uploads-analysis')
const curatedUploadKeys = new Set<ArchiveAsset['key']>([
  'azulHero',
  'azulReef',
  'azulShark',
  'azulOpenWater',
  'treesHero',
  'onmoveHero',
  'practiceProcess',
  'labFabrication',
])

const assets: ArchiveAsset[] = [
  {
    key: 'viventiHero',
    source: 'tmp/wp-uploads-import/2021/01/Viventi_mori_Cover.png',
    filename: 'viventi-mori-projection-d1e13e01.png',
    mimeType: 'image/png',
    kind: 'image',
    alt: {
      en: 'Projected botanical forms animate a skull against a black background.',
      fr: 'Des formes botaniques projetées animent un crâne sur fond noir.',
    },
    credit: 'Kommon Collective',
  },
  {
    key: 'viventiInstallation',
    source: 'tmp/wp-uploads-import/2021/10/VM_ProjectThumbnail.png',
    filename: 'viventi-mori-portable-installation-a0892ac7.png',
    mimeType: 'image/png',
    kind: 'image',
    alt: {
      en: 'The Viventi Mori projection-mapped skull installed inside its portable wooden case.',
      fr: 'Le crâne de Viventi Mori, mis en projection, installé dans son coffre portatif en bois.',
    },
    credit: 'Kommon Collective',
  },
  {
    key: 'viventiFilm',
    source: 'tmp/wp-uploads-import/2021/10/Viventi-Mori-–-Kommon-Collective.mp4',
    filename: 'viventi-mori-film-d86d0637.mp4',
    mimeType: 'video/mp4',
    kind: 'video',
    alt: {
      en: 'Viventi Mori documentation film.',
      fr: 'Film de documentation de Viventi Mori.',
    },
    credit: 'Kommon Collective',
  },
  {
    key: 'versusHero',
    source: 'assets/generated/versus-immersive-hero-v1.png',
    filename: 'versus-immersive-hero-cff893fe.png',
    mimeType: 'image/png',
    kind: 'image',
    alt: {
      en: 'Two players move through mirrored Versus VR rooms while spectators watch from the shared perimeter.',
      fr: 'Deux joueurs évoluent dans les salles VR en miroir de Versus tandis que le public observe depuis leur lisière commune.',
    },
    credit: 'Saël Simard — AI-assisted visualization',
    focalX: 58,
    focalY: 43,
  },
  {
    key: 'versusPlan',
    source: 'tmp/wp-uploads-import/2022/12/Versus-Plan-v11_2.png',
    filename: 'versus-two-room-system-plan-aa1a1dea.png',
    mimeType: 'image/png',
    kind: 'diagram',
    alt: {
      en: 'Axonometric system plan of the two-room Versus multiplayer VR installation.',
      fr: 'Plan axonométrique de l’installation VR multijoueur Versus, composée de deux salles.',
    },
    credit: 'Saël Simard',
  },
  {
    key: 'azulHero',
    source: 'public/stills/azul-vivo.jpg',
    filename: 'azul-vivo-presence-hero-d4b65d6c.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'A reef in the Seaflower Biosphere Reserve, filmed underwater for Presence.',
      fr: 'Un récif de la réserve de biosphère Seaflower, filmé sous l’eau pour Presence.',
    },
    credit: 'Saël Simard — Presence / Azul Vivo',
    focalX: 50,
    focalY: 58,
  },
  {
    key: 'azulReef',
    source: 'public/stills/azul-vivo-2.jpg',
    filename: 'azul-vivo-presence-reef-a7f6d82e.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'A wide underwater reef scene from Presence in the Seaflower Biosphere Reserve.',
      fr: 'Une vaste scène de récif sous-marin tirée de Presence, dans la réserve de biosphère Seaflower.',
    },
    credit: 'Saël Simard — Presence / Azul Vivo',
  },
  {
    key: 'azulShark',
    source: 'public/stills/azul-vivo-3.jpg',
    filename: 'azul-vivo-presence-shark-98d8a91a.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'A shark passes close to the camera above the reef in Presence.',
      fr: 'Un requin passe près de la caméra au-dessus du récif dans Presence.',
    },
    credit: 'Saël Simard — Presence / Azul Vivo',
  },
  {
    key: 'azulOpenWater',
    source: 'public/stills/azul-vivo-4.jpg',
    filename: 'azul-vivo-presence-open-water-e24379cb.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'Fish move through open blue water above the reef in Presence.',
      fr: 'Des poissons traversent l’eau bleue au-dessus du récif dans Presence.',
    },
    credit: 'Saël Simard — Presence / Azul Vivo',
  },
  {
    key: 'treesHero',
    source: 'public/stills/man-who-planted-trees.jpg',
    filename: 'man-who-planted-trees-exhibition-86a858cf.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'A child and an adult interact with a projected forest portal in The Man Who Planted Trees exhibition.',
      fr: 'Un enfant et un adulte interagissent avec un portail forestier projeté dans l’exposition L’Homme qui plantait des arbres.',
    },
    credit: 'Supply + Demand',
    focalX: 54,
    focalY: 50,
  },
  {
    key: 'onmoveHero',
    source: 'assets/captured/onmove-product-home-2026-08-21.png',
    filename: 'onmove-product-interface-958f02b2.png',
    mimeType: 'image/png',
    kind: 'image',
    alt: {
      en: 'The live OnMove product homepage presenting location-based audio and visual storytelling.',
      fr: 'La page d’accueil publique d’OnMove présentant la narration audio et visuelle géolocalisée.',
    },
    credit: 'OnMove — live product interface, captured 2026-08-21',
  },
  {
    key: 'practiceProcess',
    source: 'tmp/wp-uploads-import/2021/10/Workflow-plan.png',
    filename: 'practice-biometric-workflow-3f563f17.png',
    mimeType: 'image/png',
    kind: 'diagram',
    alt: {
      en: 'A hand-drawn systems sketch connecting biometric signals, analysis, sound and visuals.',
      fr: 'Un schéma de système dessiné à la main reliant signaux biométriques, analyse, son et visuels.',
    },
    credit: 'Saël Simard — archive process drawing',
  },
  {
    key: 'labFabrication',
    source: 'tmp/wp-uploads-import/2021/10/IMG_3431.jpg',
    filename: 'viventi-mori-fabrication-detail-2833d6eb.jpg',
    mimeType: 'image/jpeg',
    kind: 'image',
    alt: {
      en: 'Fabrication detail of the custom wooden and aluminium Viventi Mori case.',
      fr: 'Détail de fabrication du coffre sur mesure en bois et aluminium de Viventi Mori.',
    },
    credit: 'Kommon Collective — Viventi Mori fabrication archive',
  },
]

const viventiCredits = {
  en: [
    { name: 'Sylvie Béraud', role: 'Illustrations / design' },
    { name: 'Alexandre DeBavelaere / Alex Vlair', role: 'Animation / 3D / Notch' },
    { name: 'Bobby Léon', role: 'Sound' },
    { name: 'Saël Simard', role: 'Physical system / case' },
  ],
  fr: [
    { name: 'Sylvie Béraud', role: 'Illustrations / design' },
    { name: 'Alexandre DeBavelaere / Alex Vlair', role: 'Animation / 3D / Notch' },
    { name: 'Bobby Léon', role: 'Son' },
    { name: 'Saël Simard', role: 'Système physique / coffre' },
  ],
} satisfies Record<'en' | 'fr', { name: string; role: string }[]>

const versusCredits = {
  en: [{ name: 'Saël Simard', role: 'Creator / Producer' }],
  fr: [{ name: 'Saël Simard', role: 'Créateur / producteur' }],
} satisfies Record<'en' | 'fr', { name: string; role: string }[]>

const azulCredits = {
  en: [{ name: 'Saël Simard', role: 'Creator & Director' }],
  fr: [{ name: 'Saël Simard', role: 'Créateur et directeur' }],
} satisfies Record<'en' | 'fr', { name: string; role: string }[]>

const treesCredits = {
  en: [
    { name: 'Supply + Demand', role: 'Studio' },
    { name: 'Saël Simard', role: 'Technical Architecture Design' },
  ],
  fr: [
    { name: 'Supply + Demand', role: 'Studio' },
    { name: 'Saël Simard', role: 'Conception de l’architecture technique' },
  ],
} satisfies Record<'en' | 'fr', { name: string; role: string }[]>

const onmoveCredits = {
  en: [{ name: 'Saël Simard', role: 'Creator / architect' }],
  fr: [{ name: 'Saël Simard', role: 'Créateur / architecte' }],
} satisfies Record<'en' | 'fr', { name: string; role: string }[]>

const versusCopy = {
  en: {
    experience:
      'Versus occupied the 2022 Thrill Zone as two mirrored VR rooms. The plan frames entry portals, wall-scale player views, spectator displays and an exterior operator desk as a single public-facing encounter.',
    system:
      'Two adjacent play rooms share a repeatable footprint and visible operating edge. Each room combines tracked play space, a headset entry portal, a wall-scale display, overhead spectator monitors and an exterior control position; the mirrored plan supports parallel throughput and reset.',
  },
  fr: {
    experience:
      'Versus occupait la Thrill Zone 2022 sous la forme de deux salles VR en miroir. Le plan réunit portails d’entrée, vues murales des joueurs, écrans spectateurs et poste d’opération extérieur en une seule rencontre publique.',
    system:
      'Deux salles de jeu adjacentes partagent une empreinte répétable et une lisière d’opération visible. Chacune combine espace de jeu suivi, portail d’entrée avec casque, écran mural, moniteurs spectateurs en hauteur et poste de contrôle extérieur; le plan en miroir soutient le débit parallèle et la remise à zéro.',
  },
} satisfies Record<'en' | 'fr', { experience: string; system: string }>

function hasFlag(flag: string) {
  return process.argv.includes(flag)
}

function option(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function loadEnvironment(target: Target) {
  if (target === 'production') {
    const result = dotenv.config({ path: path.resolve(root, '.env.production.local'), override: true })
    if (result.error) throw result.error
    process.env.NODE_ENV = 'production'
    process.env.PAYLOAD_DB_PUSH = 'false'
    delete process.env.PAYLOAD_FORCE_DRIZZLE_PUSH
    return
  }

  dotenv.config({ path: path.resolve(root, '.env'), override: true })
  dotenv.config({ path: path.resolve(root, '.env.local'), override: true })
  process.env.NODE_ENV = 'development'
  delete process.env.VERCEL
}

function relationID(value: number | Media | null | undefined) {
  if (!value) return null
  return typeof value === 'object' ? value.id : value
}

async function sha256(file: string) {
  const buffer = await fs.readFile(file)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

async function inspectAssets() {
  return Promise.all(
    assets.map(async (asset) => {
      const absolute = path.resolve(root, asset.source)
      const stat = await fs.stat(absolute)
      return {
        ...asset,
        absolute,
        bytes: stat.size,
        sha256: await sha256(absolute),
        blobPath: `cms-media/${asset.filename}`,
      }
    }),
  )
}

async function productionBackup() {
  const { Client } = await import('pg')
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const projects = await client.query(
      `select id, slug, verification, hero_id, video_id, diagram_id, _status, updated_at
       from projects where slug = any($1::varchar[]) order by slug`,
      [['viventi-mori', 'versus']],
    )
    const ids = projects.rows.map((project) => project.id)
    const gallery = ids.length
      ? await client.query(
          `select _order, _parent_id, id, image_id
           from projects_gallery where _parent_id = any($1::int[]) order by _parent_id, _order`,
          [ids],
        )
      : { rows: [] }
    const media = await client.query(
      `select id, filename, url, blob_path, kind, updated_at
       from media
       where blob_path like 'cms-media/%' or blob_path like 'wordpress-archive/%'
       order by id`,
    )
    const migrations = await client.query(
      'select id, name, batch, updated_at, created_at from payload_migrations order by id',
    )
    return {
      projects: projects.rows,
      gallery: gallery.rows,
      media: media.rows,
      migrations: migrations.rows,
    }
  } finally {
    await client.end()
  }
}

function normalizedVideos(project: Project) {
  return (project.videos || []).map((video) => ({
    id: video.id || undefined,
    source: video.source,
    asset: relationID(video.asset),
    url: video.url || undefined,
    title: video.title,
    caption: video.caption || undefined,
    poster: relationID(video.poster),
    tracks: (video.tracks || []).map((track) => ({
      id: track.id || undefined,
      file: relationID(track.file) as number,
      kind: track.kind,
      language: track.language,
      label: track.label,
      default: track.default || false,
    })),
    startAt: video.startAt || 0,
    aspectRatio: video.aspectRatio,
  }))
}

async function findProject(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: 'en',
    fallbackLocale: false,
    draft: true,
    depth: 2,
    limit: 1,
    overrideAccess: true,
  })
  const project = result.docs[0]
  if (!project) throw new Error(`Project not found: ${slug}`)
  return project
}

async function createOrUpdateMedia(
  payload: Payload,
  asset: Awaited<ReturnType<typeof inspectAssets>>[number],
) {
  const existing = await payload.find({
    collection: 'media',
    where: {
      or: [
        { blobPath: { equals: asset.blobPath } },
        { filename: { equals: asset.filename } },
      ],
    },
    locale: 'en',
    fallbackLocale: false,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  const common = {
    alt: asset.alt.en,
    credit: asset.credit,
    kind: asset.kind,
    purpose: 'informative' as const,
    rightsConfirmed: true,
    blobPath: asset.blobPath,
    focalX: asset.focalX,
    focalY: asset.focalY,
  }

  const uploadFile = async () => ({
    data: await fs.readFile(asset.absolute),
    mimetype: asset.mimeType,
    name: asset.filename,
    size: asset.bytes,
  })
  const repairUpload = hasFlag('--repair-upload') && curatedUploadKeys.has(asset.key)
  let doc = existing.docs[0]
    ? await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: common,
        file: repairUpload ? await uploadFile() : undefined,
        locale: 'en',
        overrideAccess: true,
      })
    : null

  if (!doc) {
    const create = payload.create({
      collection: 'media',
      data: common,
      file: await uploadFile(),
      locale: 'en',
      overrideAccess: true,
    })
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 120_000))
    doc = await Promise.race([create, timeout])

    // Payload can finish the upload and commit every Blob variant while its Local API
    // promise remains open in development. Recover the committed record instead of
    // duplicating the upload or bypassing the CMS.
    if (!doc) {
      console.warn(`Upload response timed out for ${asset.key}; recovering the committed media record.`)
      for (let attempt = 0; attempt < 10 && !doc; attempt += 1) {
        const committed = await payload.find({
          collection: 'media',
          where: { blobPath: { equals: asset.blobPath } },
          locale: 'en',
          fallbackLocale: false,
          depth: 0,
          limit: 1,
          overrideAccess: true,
        })
        doc = committed.docs[0] || null
        if (!doc) await new Promise((resolve) => setTimeout(resolve, 1_000))
      }
      if (!doc) throw new Error(`Payload did not commit ${asset.key} after the upload timeout.`)
    }
  }

  await payload.update({
    collection: 'media',
    id: doc.id,
    data: { alt: asset.alt.fr },
    locale: 'fr',
    overrideAccess: true,
  })

  return doc
}

async function attachViventi(payload: Payload, media: Record<ArchiveAsset['key'], Media>) {
  const project = await findProject(payload, 'viventi-mori')
  const gallery = (project.gallery || []).map((item) => ({
    id: item.id || undefined,
    image: relationID(item.image) as number,
  }))
  if (!gallery.some((item) => item.image === media.viventiInstallation.id)) {
    gallery.push({ image: media.viventiInstallation.id })
  }

  const videos = normalizedVideos(project)
  const existingVideo = videos.find(
    (video) => video.source === 'upload' && video.asset === media.viventiFilm.id,
  )
  const video = {
    id: existingVideo?.id,
    source: 'upload' as const,
    asset: media.viventiFilm.id,
    title: 'Viventi Mori — documentation film',
    caption: 'A one-minute view of the projection-mapped object and its portable installation.',
    poster: media.viventiHero.id,
    tracks: [],
    startAt: 0,
    aspectRatio: '16:9' as const,
  }
  const nextVideos = existingVideo
    ? videos.map((item) => (item === existingVideo ? video : item))
    : [...videos, video]

  const updated = await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      heroTreatment: 'media',
      hero: media.viventiHero.id,
      gallery,
      videos: nextVideos,
      credits: viventiCredits.en,
      verification: 'verified',
    },
    locale: 'en',
    draft: project._status === 'draft',
    depth: 2,
    overrideAccess: true,
  })

  const frenchVideos = normalizedVideos(updated).map((item) =>
    item.source === 'upload' && item.asset === media.viventiFilm.id
      ? {
          ...item,
          title: 'Viventi Mori — film de documentation',
          caption: 'Une vue d’une minute de l’objet mis en projection et de son installation portative.',
        }
      : item,
  )
  await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      videos: frenchVideos,
      credits: viventiCredits.fr.map((credit, index) => ({
        ...credit,
        id: updated.credits?.[index]?.id || undefined,
      })),
    },
    locale: 'fr',
    draft: project._status === 'draft',
    overrideAccess: true,
  })
}

async function attachVersus(payload: Payload, media: Record<ArchiveAsset['key'], Media>) {
  const project = await findProject(payload, 'versus')
  const updated = await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      heroTreatment: 'media',
      hero: media.versusHero.id,
      diagram: media.versusPlan.id,
      client: 'LINKVIVA',
      experience: textToLexical(versusCopy.en.experience),
      system: textToLexical(versusCopy.en.system),
      credits: versusCredits.en,
      verification: 'verified',
    },
    locale: 'en',
    draft: project._status === 'draft',
    overrideAccess: true,
  })
  await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      client: 'LINKVIVA',
      experience: textToLexical(versusCopy.fr.experience),
      system: textToLexical(versusCopy.fr.system),
      credits: versusCredits.fr.map((credit, index) => ({
        ...credit,
        id: updated.credits?.[index]?.id || undefined,
      })),
    },
    locale: 'fr',
    draft: project._status === 'draft',
    overrideAccess: true,
  })
}

async function attachCuratedProjectMedia(
  payload: Payload,
  {
    slug,
    hero,
    gallery = [],
    credits,
  }: {
    slug: 'azul-vivo' | 'man-who-planted-trees' | 'onmove'
    hero: Media
    gallery?: Media[]
    credits: Record<'en' | 'fr', { name: string; role: string }[]>
  },
) {
  const project = await findProject(payload, slug)
  const updated = await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      heroTreatment: 'media',
      hero: hero.id,
      gallery: gallery.map((image) => ({ image: image.id })),
      credits: credits.en,
      verification: 'verified',
    },
    locale: 'en',
    draft: project._status === 'draft',
    depth: 2,
    overrideAccess: true,
  })

  await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      credits: credits.fr.map((credit, index) => ({
        ...credit,
        id: updated.credits?.[index]?.id || undefined,
      })),
    },
    locale: 'fr',
    draft: project._status === 'draft',
    overrideAccess: true,
  })
}

async function run() {
  const target = (option('--target') || 'local') as Target
  if (target !== 'local' && target !== 'production') {
    throw new Error('--target must be local or production')
  }
  const apply = hasFlag('--apply')
  const migrate = hasFlag('--migrate')
  if (target === 'production' && apply && !migrate) {
    throw new Error('Production apply requires --migrate so the additive CMS schema is present.')
  }

  loadEnvironment(target)
  const inspected = await inspectAssets()
  console.table(
    inspected.map((asset) => ({
      key: asset.key,
      source: asset.source,
      bytes: asset.bytes,
      sha256: asset.sha256,
      destination: asset.blobPath,
    })),
  )

  if (!apply) {
    console.log(`Dry run only. Re-run with --target ${target} --apply${target === 'production' ? ' --migrate' : ''}.`)
    return
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is required.')

  await fs.mkdir(analysisDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  if (target === 'production') {
    const backup = await productionBackup()
    await fs.writeFile(
      path.join(analysisDir, `production-before-import-${stamp}.json`),
      JSON.stringify(backup, null, 2),
    )
  }

  const { default: config } = await import('../src/payload.config')
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })
  try {
    if (target === 'production' && migrate) {
      const { migrations } = await import('../src/migrations')
      const developmentMarkers = await payload.find({
        collection: 'payload-migrations',
        where: { batch: { equals: -1 } },
        limit: 100,
        overrideAccess: true,
      })
      for (const marker of developmentMarkers.docs) {
        await payload.delete({
          collection: 'payload-migrations',
          id: marker.id,
          overrideAccess: true,
        })
        console.log(`Replaced development schema marker ${marker.id} with explicit migrations.`)
      }
      await payload.db.migrate({ migrations })
    }

    const imported = {} as Record<ArchiveAsset['key'], Media>
    for (const asset of inspected) {
      const doc = await createOrUpdateMedia(payload, asset)
      imported[asset.key] = doc
      console.log(`${asset.key}: media ${doc.id} → ${doc.url || doc.filename}`)
    }

    await payload.update({
      collection: 'media',
      id: imported.viventiFilm.id,
      data: { poster: imported.viventiHero.id },
      overrideAccess: true,
    })
    await attachViventi(payload, imported)
    await attachVersus(payload, imported)
    await attachCuratedProjectMedia(payload, {
      slug: 'azul-vivo',
      hero: imported.azulHero,
      gallery: [imported.azulReef, imported.azulShark, imported.azulOpenWater],
      credits: azulCredits,
    })
    await attachCuratedProjectMedia(payload, {
      slug: 'man-who-planted-trees',
      hero: imported.treesHero,
      credits: treesCredits,
    })
    await attachCuratedProjectMedia(payload, {
      slug: 'onmove',
      hero: imported.onmoveHero,
      credits: onmoveCredits,
    })

    const result = inspected.map((asset) => ({
      key: asset.key,
      source: asset.source,
      sha256: asset.sha256,
      blobPath: asset.blobPath,
      mediaId: imported[asset.key].id,
      url: imported[asset.key].url,
    }))
    await fs.writeFile(
      path.join(analysisDir, `${target}-import-result.json`),
      JSON.stringify(result, null, 2),
    )
    console.log(
      `Imported ${result.length} assets and attached Azul Vivo / OnMove / The Man Who Planted Trees / Viventi Mori / Versus.`,
    )
  } finally {
    await payload.destroy()
  }
}

run().then(
  () => process.exit(0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
