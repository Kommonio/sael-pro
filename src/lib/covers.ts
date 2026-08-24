export type Cover = {
  src: string
  credit?: string
  alt: string
}

const CMS_BLOB = 'https://gz0b2komdddv1cof.public.blob.vercel-storage.com/cms-media'

const COVERS: Record<string, Cover> = {
  'azul-vivo': {
    src: '/stills/azul-vivo.jpg',
    credit: 'Saël Simard — Presence, Seaflower',
    alt: 'Underwater still from Presence, filmed in the Seaflower reef',
  },
  'man-who-planted-trees': {
    src: '/stills/man-who-planted-trees.jpg',
    credit: 'Supply + Demand',
    alt: 'The Man Who Planted Trees immersive exhibition',
  },
  onmove: {
    src: `${CMS_BLOB}/onmove-location-story-d47921a7.webp`,
    credit: 'Saël Simard — AI-assisted visualization grounded in OnMove’s location-aware listening model',
    alt: 'A listener walks through a Montréal street while experiencing a location-aware OnMove story',
  },
  'viventi-mori': {
    src: `${CMS_BLOB}/viventi-mori-projection-d1e13e01.png`,
    credit: 'Kommon Collective',
    alt: 'Projected botanical forms animate a skull against a black background',
  },
  versus: {
    src: `${CMS_BLOB}/versus-immersive-hero-cff893fe.png`,
    credit: 'Saël Simard — AI-assisted visualization',
    alt: 'Two players move through mirrored Versus VR rooms while spectators watch from the shared perimeter',
  },
}

const VERSUS_PLAN: Cover = {
  src: `${CMS_BLOB}/versus-two-room-system-plan-aa1a1dea.png`,
  credit: 'Saël Simard',
  alt: 'Axonometric system plan of the two-room Versus multiplayer VR installation',
}

const VIVENTI_INSTALLATION: Cover = {
  src: `${CMS_BLOB}/viventi-mori-portable-installation-a0892ac7.png`,
  credit: 'Kommon Collective',
  alt: 'The Viventi Mori projection-mapped skull installed inside its portable wooden case',
}

const ONMOVE_INTERFACE: Cover = {
  src: `${CMS_BLOB}/onmove-product-interface-958f02b2-1.png`,
  credit: 'OnMove — live product interface, captured 2026-08-21',
  alt: 'The live OnMove product homepage presenting location-based audio and visual storytelling',
}

export const GALLERY: Record<string, Cover[]> = {
  'azul-vivo': [
    COVERS['azul-vivo'],
    { src: '/stills/azul-vivo-2.jpg', credit: 'Saël Simard — Presence', alt: 'Reef still from Presence' },
    { src: '/stills/azul-vivo-3.jpg', credit: 'Saël Simard — Presence', alt: 'Shark encounter from Presence' },
    { src: '/stills/azul-vivo-4.jpg', credit: 'Saël Simard — Presence', alt: 'Open water from Presence' },
  ],
  onmove: [COVERS.onmove, ONMOVE_INTERFACE],
  'viventi-mori': [COVERS['viventi-mori'], VIVENTI_INSTALLATION],
  versus: [COVERS.versus, COVERS.versus, VERSUS_PLAN],
}

export const PORTRAIT: Cover = {
  src: '/stills/sael-portrait.jpg',
  credit: 'Supply + Demand',
  alt: 'Saël Simard',
}

export const ABOUT_STILL: Cover = {
  src: `${CMS_BLOB}/about-systems-practice-5f001df0.webp`,
  credit: 'Saël Simard — AI-assisted editorial visualization of the multidisciplinary practice',
  alt: 'A systems-design worktable connecting a hand-drawn topology, signal hardware, fabrication and image-making',
}

export const CONTACT_STILL: Cover = {
  src: `${CMS_BLOB}/contact-studio-threshold-811f77ca.webp`,
  credit: 'Saël Simard — AI-assisted editorial visualization of a Montréal studio threshold',
  alt: 'An available chair at a Montréal studio worktable between cool window light and a warm workshop',
}

export const SECTION: Record<'practice' | 'lab', Cover> = {
  practice: {
    src: `${CMS_BLOB}/practice-biometric-workflow-3f563f17-1.png`,
    credit: 'Saël Simard — archive process drawing',
    alt: 'A hand-drawn systems sketch connecting biometric signals, analysis, sound and visuals',
  },
  lab: {
    src: `${CMS_BLOB}/viventi-mori-fabrication-detail-2833d6eb-1.jpg`,
    credit: 'Kommon Collective — Viventi Mori fabrication archive',
    alt: 'Fabrication detail of the custom wooden and aluminium Viventi Mori case',
  },
}

export function coverFor(slug?: string | null): Cover | null {
  if (!slug) return null
  return COVERS[slug] || null
}

export function shouldPreferCover(slug?: string | null) {
  return slug === 'onmove'
}
