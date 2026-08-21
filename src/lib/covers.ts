export type Cover = {
  src: string
  credit?: string
  alt: string
}

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
}

export const GALLERY: Record<string, Cover[]> = {
  'azul-vivo': [
    COVERS['azul-vivo'],
    { src: '/stills/azul-vivo-2.jpg', credit: 'Saël Simard — Presence', alt: 'Reef still from Presence' },
    { src: '/stills/azul-vivo-3.jpg', credit: 'Saël Simard — Presence', alt: 'Shark encounter from Presence' },
    { src: '/stills/azul-vivo-4.jpg', credit: 'Saël Simard — Presence', alt: 'Open water from Presence' },
  ],
}

export const PORTRAIT: Cover = {
  src: '/stills/sael-portrait.jpg',
  credit: 'Supply + Demand',
  alt: 'Saël Simard',
}

export const SECTION: Record<'practice' | 'lab', Cover> = {
  practice: {
    src: '/api/media/file/practice-biometric-workflow-3f563f17-1.png?prefix=cms-media',
    credit: 'Saël Simard — archive process drawing',
    alt: 'A hand-drawn systems sketch connecting biometric signals, analysis, sound and visuals',
  },
  lab: {
    src: '/api/media/file/viventi-mori-fabrication-detail-2833d6eb-1.jpg?prefix=cms-media',
    credit: 'Kommon Collective — Viventi Mori fabrication archive',
    alt: 'Fabrication detail of the custom wooden and aluminium Viventi Mori case',
  },
}

export function coverFor(slug?: string | null): Cover | null {
  if (!slug) return null
  return COVERS[slug] || null
}
