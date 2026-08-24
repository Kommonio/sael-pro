import type { ProjectCardData } from '@/components/ProjectCard'
import type { Locale } from '@/i18n/config'

export const FEATURED_SLUGS = [
  'azul-vivo',
  'man-who-planted-trees',
  'onmove',
  'omega-protocol',
  'viventi-mori',
] as const

type CardSeed = ProjectCardData & { featured?: boolean }

const PROJECTS: Record<string, CardSeed> = {
  'azul-vivo': {
    slug: 'azul-vivo',
    year: '2026–',
    role: 'Creator & Director',
    authorship: 'authored',
    tags: ['authored', 'immersive'],
    climateHint: 'sap',
    featured: true,
    landingPosition: 'primary',
    title: 'Azul Vivo',
    lede: 'An immersive underwater documentary practice — 360° image, spatial sound, institutional VR and fulldome.',
  },
  onmove: {
    slug: 'onmove',
    year: '2022–',
    role: 'Creator / Application & Platform Architect',
    authorship: 'authored',
    tags: ['authored', 'software', 'interactive'],
    climateHint: 'moss',
    featured: true,
    landingPosition: 'secondary',
    title: 'OnMove',
    lede: 'A platform for creating, managing and delivering location-aware immersive media — not an audio-guide app.',
  },
  echoes: {
    slug: 'echoes',
    year: '2023–2024',
    role: 'Creator / System Architect',
    studio: 'Kommon.io',
    authorship: 'authored',
    tags: ['authored', 'systems', 'interactive'],
    climateHint: 'clay',
    title: 'Echoes',
    lede: 'Biometric middleware: how physiological signals move through a complete pipeline and become usable by realtime media.',
  },
  'man-who-planted-trees': {
    slug: 'man-who-planted-trees',
    year: '2025',
    role: 'Technical Architecture Design — Supply + Demand',
    studio: 'Supply + Demand',
    authorship: 'contribution',
    tags: ['systems', 'immersive'],
    climateHint: 'moss',
    featured: true,
    title: 'The Man Who Planted Trees',
    lede: 'A touring immersive exhibition. Official credit: Technical Architecture Design, Saël Simard.',
  },
  'viventi-mori': {
    slug: 'viventi-mori',
    year: '2018–2019',
    role: 'Physical system / case design and fabrication — collaborative creator',
    studio: 'Kommon Collective',
    authorship: 'collaborative',
    tags: ['immersive', 'interactive', 'experiments'],
    climateHint: 'earth',
    featured: true,
    title: 'Viventi Mori',
    lede: 'A portable projection-mapping object: a skull, a suitcase, a meditation on life, death, creation and decay.',
  },
  'omega-protocol': {
    slug: 'omega-protocol',
    year: '2023',
    role: 'Creator / Producer',
    authorship: 'authored',
    tags: ['authored', 'immersive', 'interactive'],
    climateHint: 'clay',
    featured: true,
    title: 'Omega Protocol',
    lede: 'A multiplayer immersive VR game at public festival scale — science-fiction combat with a teleportation system.',
  },
  versus: {
    slug: 'versus',
    year: '2022',
    role: 'Creator / Producer',
    authorship: 'authored',
    tags: ['authored', 'immersive', 'interactive'],
    climateHint: 'clay',
    title: 'Versus',
    lede: 'A multiplayer immersive VR experience — the year before Omega Protocol, in the same festival lineage.',
  },
  'villa-hublot': {
    slug: 'villa-hublot',
    year: '2022',
    role: 'System Designer — Bakuza Events',
    studio: 'Bakuza Events',
    authorship: 'contribution',
    tags: ['systems', 'interactive'],
    climateHint: 'earth',
    title: 'Villa Hublot',
    lede: 'Interactive multimedia systems for Hublot’s World Cup hospitality environment. Not an independently authored project.',
  },
  'sensory-odyssey': {
    slug: 'sensory-odyssey',
    year: '2026',
    role: 'System Designer — Supply + Demand',
    studio: 'Supply + Demand',
    authorship: 'contribution',
    tags: ['systems', 'immersive'],
    climateHint: 'sap',
    title: 'Sensory Odyssey / Vivid',
    lede: 'North American deployment of a multisensory touring exhibition. Content by Sensory Odyssey Studio. I did not create Sensory Odyssey.',
  },
  'le-repaire': {
    slug: 'le-repaire',
    year: '2026',
    role: 'System Designer / Integrator — Supply + Demand',
    studio: 'Supply + Demand',
    authorship: 'contribution',
    tags: ['systems', 'interactive'],
    climateHint: 'earth',
    title: 'Le Repaire (secret secret)',
    lede: 'An immersive journey for children through historic pulp railway cars. Studio production; my role is systems and integration.',
  },
}

const PROJECTS_FR: Partial<Record<string, Pick<CardSeed, 'title' | 'role' | 'lede'>>> = {
  'azul-vivo': {
    title: 'Azul Vivo',
    role: 'Créateur et directeur',
    lede: 'Une pratique documentaire sous-marine immersive — image 360°, son spatial, RV institutionnelle et fulldome.',
  },
  onmove: {
    title: 'OnMove',
    role: 'Créateur / architecte de la plateforme',
    lede: 'Une plateforme pour créer, gérer et diffuser des médias immersifs sensibles au lieu — pas un audioguide.',
  },
  echoes: {
    title: 'Echoes',
    role: 'Créateur / architecte de système',
    lede: 'Intergiciel biométrique : comment des signaux physiologiques traversent une chaîne complète et deviennent utilisables par des médias temps réel.',
  },
  'man-who-planted-trees': {
    title: 'L’Homme qui plantait des arbres',
    role: 'Conception de l’architecture technique — Supply + Demand',
    lede: 'Une exposition immersive en tournée. Crédit officiel : conception de l’architecture technique, Saël Simard.',
  },
  'viventi-mori': {
    title: 'Viventi Mori',
    role: 'Système physique / conception et fabrication du coffre — créateur collaboratif',
    lede: 'Un objet de projection mapping portable : un crâne, une valise, une méditation sur la vie, la mort, la création et la décomposition.',
  },
  'omega-protocol': {
    title: 'Omega Protocol',
    role: 'Créateur / producteur',
    lede: 'Un jeu VR immersif multijoueur à l’échelle d’un festival — combat de science-fiction avec un système de téléportation.',
  },
  versus: {
    title: 'Versus',
    role: 'Créateur / producteur',
    lede: 'Une expérience VR immersive multijoueur — l’année avant Omega Protocol, dans la même lignée de festival.',
  },
  'villa-hublot': {
    title: 'Villa Hublot',
    role: 'Concepteur de systèmes — Bakuza Events',
    lede: 'Systèmes multimédias interactifs pour l’environnement d’hospitalité Hublot à la Coupe du monde. Pas un projet d’auteur indépendant.',
  },
  'sensory-odyssey': {
    title: 'Sensory Odyssey / Vivid',
    role: 'Concepteur de systèmes — Supply + Demand',
    lede: 'Déploiement nord-américain d’une exposition multisensorielle en tournée. Contenu : Sensory Odyssey Studio. Je n’ai pas créé Sensory Odyssey.',
  },
  'le-repaire': {
    title: 'Le Repaire (secret secret)',
    role: 'Concepteur de systèmes / intégrateur — Supply + Demand',
    lede: 'Un parcours immersif pour enfants dans d’authentiques wagons de pulpe. Production de studio ; mon rôle est systèmes et intégration.',
  },
}

export function yearBounds(year?: string | null) {
  const text = (year || '').trim()
  const years = [...text.matchAll(/\d{4}/g)].map((match) => Number(match[0]))
  const start = years[0] || 0
  const ongoing = /[–-]\s*$/.test(text)
  const end = ongoing ? new Date().getFullYear() : years[years.length - 1] || start
  return { start, end, ongoing }
}

export function compareByRecency(
  a: { year?: string | null; authorship?: string | null },
  b: { year?: string | null; authorship?: string | null },
) {
  const A = yearBounds(a.year)
  const B = yearBounds(b.year)
  if (B.end !== A.end) return B.end - A.end
  if (B.start !== A.start) return B.start - A.start
  const rank = (value?: string | null) => (value === 'authored' ? 0 : value === 'collaborative' ? 1 : 2)
  return rank(a.authorship) - rank(b.authorship)
}

export function sortByRecency<T extends { year?: string | null; authorship?: string | null }>(items: T[]) {
  return [...items].sort(compareByRecency)
}

export function catalogProjectCards(locale: Locale): Array<ProjectCardData & { featured?: boolean }> {
  return sortByRecency(
    Object.values(PROJECTS).map((project) => {
      const localized = locale === 'fr' ? PROJECTS_FR[project.slug] : undefined
      return {
        ...project,
        title: localized?.title || project.title,
        role: localized?.role || project.role,
        lede: localized?.lede || project.lede,
        tags: project.tags,
      }
    }),
  )
}

export function catalogFeatured(locale: Locale) {
  const cards = catalogProjectCards(locale)
  return FEATURED_SLUGS.map((slug) => cards.find((card) => card.slug === slug)).filter(
    (card): card is NonNullable<typeof card> => Boolean(card),
  )
}

export function catalogLab(locale: Locale) {
  return [
    {
      slug: 'i-speak-it',
      year: '2025',
      url: 'https://ispeakit.app',
      title: 'I Speak It',
      lede:
        locale === 'fr'
          ? 'Une petite appli de langue assistée par IA, expédiée parce qu’un problème précis était là.'
          : 'A small AI-assisted language app, shipped because a specific problem was sitting there.',
    },
    {
      slug: 'youspoty',
      year: '2025',
      url: 'https://youspoty.vercel.app',
      title: 'YouSpoty',
      lede:
        locale === 'fr'
          ? 'Un utilitaire pour échanger bibliothèques Spotify et YouTube Music. Pensée produit légère. Aucun détail d’accès privé ici.'
          : 'A utility for swapping Spotify and YouTube Music libraries. Lightweight product thinking. No private access details here.',
    },
  ]
}

export type PracticeBlock = { title: string; body: string }

export function catalogPracticeSteps(locale: Locale): PracticeBlock[] {
  if (locale === 'fr') {
    return [
      {
        title: 'Expérience',
        body: 'Que doit vivre, remarquer, comprendre, retenir ou faire une personne ? Le médium vient après. L’explication aussi. Si le public a besoin d’un tutoriel, l’interface concurrence encore la rencontre.',
      },
      {
        title: 'Système',
        body: 'L’objet intéressant est rarement un livrable isolé. C’est la chaîne : écriture, lieu, corps, média, opérateurs. Dépendances, interfaces, modes de panne, flux — tenus ensemble pour que l’expérience tienne.',
      },
      {
        title: 'Interface',
        body: 'Donner un métier à la technique, puis la laisser disparaître. Un système peut être extrêmement sophistiqué alors que la rencontre reste simple. La complexité en dessous ; la clarté à la surface.',
      },
      {
        title: 'Déploiement',
        body: 'Si ça ne s’installe pas, ne voyage pas, ne se réinitialise pas et ne se maintient pas, ce n’est pas fini. Visiteur, technicien, régisseur, maintenance : tout le monde autour du projet est un utilisateur.',
      },
    ]
  }
  return [
    {
      title: 'Experience',
      body: 'What should a person experience, notice, understand, remember, or do? The medium comes after. Explanation too. If the audience needs a tutorial, the interface is still competing with the encounter.',
    },
    {
      title: 'System',
      body: 'The interesting object is rarely an isolated deliverable. It is the chain: authoring, place, body, media, operators. Dependencies, interfaces, failure modes, flows — held together so the experience can hold.',
    },
    {
      title: 'Interface',
      body: 'Give technology a job, then let it disappear. A system can be extremely sophisticated while the encounter stays simple. Complexity underneath; clarity at the surface.',
    },
    {
      title: 'Deployment',
      body: 'If it cannot install, tour, reset and be maintained, it is not finished. Visitor, technician, stage manager, maintenance: everyone around the project is a user.',
    },
  ]
}

export function catalogAbout(locale: Locale) {
  if (locale === 'fr') {
    return {
      title: 'Architecte de systèmes. Technologue créatif. Créateur de médias immersifs.',
      currentRole:
        'Architecte de systèmes chez Supply + Demand (depuis janvier 2026). Basé à Montréal. Pratique indépendante via Kommon.io depuis 2017.',
      bio: 'La pratique traverse des frontières habituellement séparées : concept, design d’expérience, logiciel, médias temps réel, architecture AV/IT, matériel, fabrication, production de terrain, installation, opération.\n\nJe ne suis pas d’abord designer d’interface, développeur web conventionnel, intégrateur AV, cinéaste ou ingénieur logiciel — même si j’ai une pratique crédible dans chacun de ces domaines. Le travail distinctif est de les relier en systèmes d’expérience cohérents.\n\nLe parcours est passé de la cinématographie à l’UQAM, aux environnements interactifs et aux systèmes en tournée, jusqu’à des mondes immersifs d’auteur. Le fil est le même : concevoir ce qui doit exister — techniquement, physiquement, spatialement et perceptuellement — pour qu’une expérience paraisse inévitable.',
      phases: [
        {
          title: 'Image',
          body: 'Communication et cinématographie à l’UQAM. Cadre, récit, instinct documentaire — une formation d’abord tournée vers l’image, y compris un intérêt précoce pour le documentaire.\n\nMême lorsque le travail est devenu profondément technique, le système n’était rarement une fin. L’image reste la raison d’être de l’architecture.',
        },
        {
          title: 'Environnements',
          body: 'Vers la seconde moitié des années 2010, la pratique s’est déplacée vers les médias interactifs, le mapping, les systèmes temps réel, les installations, les serveurs média.\n\nL’écran n’est plus l’objet final. Comment le média occupe l’architecture, comment un corps traverse un espace, comment les objets deviennent des interfaces — et comment une architecture technique peut disparaître dans une expérience.',
        },
        {
          title: 'Systèmes',
          body: 'Circo de Bakuza, TKNL, Kommon.io, puis Supply + Demand. Topologie du signal, serveurs média, réseaux, interaction, intégration physique, tournée, maintenabilité.\n\n« Technologue créatif » ne suffit plus. Le travail consiste à concevoir les relations entre sous-systèmes — ce qui doit exister pour que l’expérience tienne, une fois le public, les opérateurs et le réel dans la salle.',
        },
        {
          title: 'Mondes d’auteur',
          body: 'OnMove et Echoes ont étendu cette pensée à l’infrastructure logicielle : participant, contenu, lieu, capteurs, nuage, installations, opérations institutionnelles, média temps réel.\n\nAzul Vivo rassemble l’image, la production de terrain, la RV, le fulldome et le propos. Ce n’est pas un projet technique de plus. C’est le passage vers un travail immersif d’auteur, plus contemplatif.',
        },
      ],
      capabilities: [
        { domain: 'Médias immersifs', note: 'RV, 360°, fulldome, lecture temps réel, image spatiale.' },
        { domain: 'Applications', note: 'Plateformes sensibles au lieu, PWA, données temps réel, outils d’écriture.' },
        { domain: 'AV / systèmes', note: 'Serveurs vidéo, AV-over-IP, show control, supervision, virtualisation.' },
        { domain: 'Physique', note: 'Fabrication, capteurs, interfaces sur mesure, captation de terrain, installation.' },
      ],
      education: [
        { place: 'UQAM', detail: 'B.A. Communication — cinématographie', years: '2009–2012' },
        { place: 'UQAM / Tunis', detail: 'Langue et culture arabes', years: '2012–2013' },
        { place: 'SAT', detail: 'TouchDesigner', years: '2018' },
        { place: 'Disguise, New York', detail: 'D3 Manager', years: '2019' },
      ],
    }
  }
  return {
    title: 'System architect. Creative technologist. Immersive-media creator.',
    currentRole:
      'System Architect at Supply + Demand (since January 2026). Based in Montréal. Independent practice as Kommon.io since 2017.',
    bio: 'The practice crosses boundaries that are usually separated: concept, experience design, software, realtime media, AV/IT architecture, hardware, fabrication, field production, installation, operation.\n\nI am not primarily a UI designer, conventional web developer, AV installer, filmmaker or software engineer — though I have credible practice in all of those. The distinctive work is connecting them into coherent experiential systems.\n\nThe career moved from cinematography at UQAM, through interactive environments and touring systems, into authored immersive worlds. The through-line is the same: design what has to exist — technically, physically, spatially and perceptually — for an experience to feel inevitable.',
    phases: [
      {
        title: 'Image',
        body: 'Communication and cinematography at UQAM. Framing, narrative, documentary instinct — a foundation first turned toward the image, including an early interest in documentary.\n\nEven when the work became deeply technical, the system was rarely an end in itself. The image is still the reason the architecture exists.',
      },
      {
        title: 'Environments',
        body: 'Around the second half of the 2010s the practice moved toward interactive media, projection, realtime systems, installations, media servers.\n\nThe screen is no longer the final object. How media occupies architecture, how a body moves through a space, how objects become interfaces — and how a technical architecture can disappear into an experience.',
      },
      {
        title: 'Systems',
        body: 'Circo de Bakuza, TKNL, Kommon.io, then Supply + Demand. Signal topology, media servers, networks, interaction, physical integration, touring, maintainability.\n\n“Creative technologist” is no longer enough. The work is designing the relationships between subsystems — what has to exist for the experience to hold once the public, the operators and reality are in the room.',
      },
      {
        title: 'Authored worlds',
        body: 'OnMove and Echoes extended this thinking into software infrastructure: participant, content, place, sensors, cloud, installations, institutional operations, realtime media.\n\nAzul Vivo gathers image, field production, VR, fulldome and purpose. It is not another technical project. It is the turn toward authored, more contemplative immersive work.',
      },
    ],
    capabilities: [
      { domain: 'Immersive media', note: 'VR, 360°, fulldome, realtime playback, spatial image.' },
      { domain: 'Applications', note: 'Location-aware platforms, PWAs, realtime data, authoring tools.' },
      { domain: 'AV / systems', note: 'Video servers, AV-over-IP, show control, monitoring, virtualization.' },
      { domain: 'Physical', note: 'Fabrication, sensors, custom interfaces, field capture, installation.' },
    ],
    education: [
      { place: 'UQAM', detail: 'B.A. Communication — cinematography', years: '2009–2012' },
      { place: 'UQAM / Tunis', detail: 'Arabic language and culture', years: '2012–2013' },
      { place: 'SAT', detail: 'TouchDesigner', years: '2018' },
      { place: 'Disguise, New York', detail: 'D3 Manager', years: '2019' },
    ],
  }
}

export function catalogPractice(locale: Locale) {
  const chain = catalogPracticeSteps(locale)
  if (locale === 'fr') {
    return {
      title: 'Comment une chose devient inévitable.',
      intro:
        'Ce n’est pas une page de services. C’est la grammaire du travail : concevoir ce qui doit exister — techniquement, physiquement, spatialement et perceptuellement — pour qu’une expérience paraisse inévitable. Concept, logiciel, média temps réel, architecture AV/IT, fabrication, terrain, installation, opération : tenus comme une seule rencontre.',
      chain,
      sections: [
        {
          title: 'L’expérience d’abord',
          body: 'La question de départ n’est jamais l’outil. Je ne commence pas par « je veux utiliser TouchDesigner » ou « ça devrait être de la RV ». La question plus juste est : que doit vivre une personne — remarquer, comprendre, retenir, faire ? Ensuite seulement le médium devient une décision.\n\nLe public a le droit de rencontrer avant que le système n’explique. Pas d’étiquettes inutiles sur un animal sous-marin. Pas d’interaction pour prouver qu’un système est interactif. Pas de tableau de bord quand un geste suffit. Pas de vitrine technologique qui concurrence l’expérience.\n\nC’est un principe artistique, pas seulement une règle d’Azul Vivo. L’explication vient après. Interagir n’est pas la même chose qu’entrer une donnée.',
        },
        {
          title: 'Interagir n’est pas entrer une donnée',
          body: 'Méfiance envers l’interaction-spectacle : le participant bouge, les particules bougent. À moins que ce geste ne produise du sens, il n’appartient pas.\n\nUne interaction plus caractéristique observe, découvre, retient, affecte un système partagé de façon indirecte, révèle une relation cachée, laisse le contexte physique altérer le comportement numérique, laisse le système devenir attentif au participant.\n\nLa question n’est pas « comment le public peut-il affecter le média ? ». C’est parfois l’inverse : comment un système immersif influence-t-il le corps — si l’on refuse d’expliquer chaque rencontre ?',
        },
        {
          title: 'Les contraintes comme matière',
          body: 'Lieu, matériel, conditions de terrain, budget, public, opérateur, tournée, bande passante, sécurité, environnement, temps d’install, distribution. Les contraintes arrivent tôt dans le processus. Elles ne sont pas des obstacles à protéger contre un concept.\n\nLe but est de découvrir la version du concept qui devient plus forte parce qu’elle comprend le réel. Une idée qui ne survit qu’en laboratoire n’est pas encore conçue.',
        },
        {
          title: 'Ce qui doit rester vrai',
          body: 'Définir un ensemble de cibles — de l’effet émotionnel à la perspective physique — puis s’en servir comme règles. Ce qui ne se négocie pas. Ce que le public doit percevoir. L’environnement physique et opérationnel. Ensuite, chaque sous-système se juge à ces règles.\n\nC’est pourquoi les décisions artistiques et techniques se parlent : elles sont évaluées contre le même objectif d’expérience.',
        },
        {
          title: 'Suivre la question',
          body: 'La pratique est large parce qu’une question ne s’arrête pas où un titre de poste s’arrête. Si comprendre le problème demande du code, de l’optique, de l’impression 3D, un réseau, du design d’interaction, une captation sous-marine, une architecture nuage, de la fabrication, de la biologie ou une géométrie de projection, j’apprends assez de la discipline voisine pour décider et collaborer.\n\nJe peux porter un projet à travers plusieurs domaines. La meilleure description n’est pas « homme-orchestre ». C’est : tenir le système entier en tête, en construire une part substantielle, et travailler avec des spécialistes sans perdre la cohérence de l’expérience.',
        },
        {
          title: 'Toute la relation',
          body: 'Le travail le plus fort se représente comme une chaîne, pas comme un livrable. OnMove n’est pas « un frontend React ». C’est créateur → contenu → nuage → lieu → participant. Echoes n’est pas « une appli Flutter ». C’est corps → capteur → micrologiciel → protocole → appli → transport → agrégation → client → média.\n\nMême une idée créative se tourne souvent en structure : timeline, modèle de données, grammaire d’interaction, chemin de signal, logique de scène, registre de décisions, topologie technique.',
        },
        {
          title: 'Le prototype comme pensée',
          body: 'Je construis des systèmes partiels pour découvrir ce que le système final doit être : prototypes logiciels, pièces imprimées, petits rigs, tests de projection et de média temps réel, systèmes de caméra et de lest sous-marins, essais fulldome, applis temporaires.\n\nLa méthode n’est pas une marche linéaire idée → design → construction. C’est plus proche de boucles : observer, cadrer, prototyper, tester, apprendre, restructurer.',
        },
        {
          title: 'Précision sans rigidité',
          body: 'L’ingénierie exige la précision ; le travail artistique, la découverte ; le terrain, l’adaptation. Le processus le plus fort n’élimine pas l’incertitude. Il crée une structure assez robuste pour travailler avec elle.\n\nEchoes en est un exemple conceptuel : les signaux physiologiques sont bruyants et probabilistes, contrairement à un système de cues déterministe. Le système doit préserver l’incertitude plutôt que de prétendre que les données sont absolues. Être exact sur ce qui peut se connaître, et souple sur ce qui ne peut pas.',
        },
        {
          title: 'Tout le monde autour du projet',
          body: 'L’expérience publique n’est pas le seul utilisateur. Visiteur, commissaire, technicien, opérateur, régisseur, producteur, équipe de maintenance, commanditaire le cas échéant.\n\nUne expérience magnifique pour le public et misérable à installer, diagnostiquer, tourner, réinitialiser ou maintenir n’est pas entièrement conçue. C’est particulièrement vrai du travail d’architecture de systèmes à l’échelle d’un musée, d’une tournée, d’une salle.',
        },
        {
          title: 'Pas de gadget',
          body: 'Rejet de la technique dont la justification première est la nouveauté. La bonne question n’est pas « est-ce cool ? ». Est-ce que ça appartient ? Qu’est-ce que ça révèle ? Qu’est-ce que ça rend possible ? Est-ce que ça augmente la présence, ou est-ce que ça fragmente l’attention ?\n\nLe public doit-il comprendre quoi faire sans qu’on le lui enseigne par l’interface ? Si la réponse est non, le système concourt encore avec l’expérience qu’il prétend servir.',
        },
      ],
    }
  }
  return {
    title: 'How a thing becomes inevitable.',
    intro:
      'This is not a services page. It is the grammar of the work: designing what has to exist — technically, physically, spatially and perceptually — for an experience to feel inevitable. Concept, software, realtime media, AV/IT architecture, fabrication, field, installation, operation: held as one encounter.',
    chain,
    sections: [
      {
        title: 'Experience first',
        body: 'The starting question is never the tool. I do not begin with “I want to use TouchDesigner” or “this should be VR.” The stronger question is: what should a person experience — notice, understand, remember, do? Only then does the medium become a design decision.\n\nThe audience is allowed to encounter something before the system explains it. No unnecessary labels over an underwater animal. No interaction simply to prove a system is interactive. No dashboard when one gesture will do. No technology showcase that competes with the experience.\n\nThis is an artistic principle, not only an Azul Vivo rule. Explanation comes second. Interaction is not the same as input.',
      },
      {
        title: 'Interaction is not input',
        body: 'Skepticism toward interaction-as-spectacle: participant moves, particles move. Unless that gesture produces meaning, it does not belong.\n\nA more characteristic act is to observe, discover, remember, affect a shared system indirectly, reveal a hidden relationship, let physical context alter digital behavior, let the system become attentive to the participant.\n\nThe question is not always “how can the participant affect the media?” Sometimes it inverts: how does an immersive system influence the body — if we refuse to explain every encounter?',
      },
      {
        title: 'Constraints as material',
        body: 'Venue, hardware, field conditions, budget, audience, operator, travel, bandwidth, safety, environment, install time, distribution. Constraints enter the process early. They are not obstacles to protect a concept against.\n\nThe goal is to discover the version of the concept that becomes stronger because it understands reality. An idea that only survives in the lab is not yet designed.',
      },
      {
        title: 'What must remain true',
        body: 'Define a set of targets — from emotional effect to physical perspective — and use them as rules. What cannot be compromised. What the audience should perceive. The physical and operational environment. Then every subsystem is judged against those rules.\n\nThis is why artistic and technical decisions speak to each other: both are evaluated against the same experiential objective.',
      },
      {
        title: 'Follow the question',
        body: 'The practice is broad because a question does not stop where a job title stops. If understanding the problem requires code, optics, 3D printing, networking, interaction design, underwater capture, cloud architecture, fabrication, biology or projection geometry, I learn enough of the adjacent discipline to decide and collaborate.\n\nI can carry a project across many domains. The strongest description is not “one-man army.” It is: hold the whole system in my head, build substantial parts directly, and collaborate with specialists without losing the coherence of the experience.',
      },
      {
        title: 'The whole relationship',
        body: 'The strongest work is represented as a chain, not a deliverable. OnMove is not “a React frontend.” It is creator → content → cloud → location → participant. Echoes is not “a Flutter app.” It is body → sensor → firmware → protocol → app → transport → aggregation → client → media.\n\nEven a creative idea is often turned into a structure: timeline, data model, interaction grammar, signal path, scene logic, decision register, technical topology.',
      },
      {
        title: 'Prototype to think',
        body: 'I build partial systems in order to discover what the final system needs to be: software prototypes, printed parts, small rigs, projection and realtime media tests, underwater camera and ballast systems, fulldome trials, temporary apps.\n\nThe method is not a linear march from idea → design → build. It is closer to loops: observe, frame, prototype, test, learn, restructure.',
      },
      {
        title: 'Precision without rigidity',
        body: 'Engineering requires precision; artistic work requires discovery; field work requires adaptation. The strongest process does not eliminate uncertainty. It creates a structure robust enough to work with it.\n\nEchoes is a useful conceptual example: physiological signals are noisy and probabilistic, unlike a deterministic cue system. The system has to preserve uncertainty rather than pretending the data is absolute. Be exact about what can be known, and flexible about what cannot.',
      },
      {
        title: 'Everyone around the project',
        body: 'The public-facing visitor is not the only user. Visitor, curator, technician, operator, stage manager, producer, maintenance, sponsor where it applies.\n\nA great public experience that is miserable to install, diagnose, tour, reset or maintain is not fully designed. That has become more important, not less, as projects grew in scale — museums, touring systems, rooms that have to run without the author in them.',
      },
      {
        title: 'No gimmick',
        body: 'Technology whose primary justification is novelty does not belong. The right question is not “is it cool?” Does it belong? What does it reveal? What does it make possible? Does it increase presence, or fragment attention?\n\nDoes the audience understand what to do without being instructed through the interface? If not, the system is still competing with the experience it claims to serve.',
      },
    ],
  }
}

export function overlayPracticeCopy(
  catalog: PracticeBlock[],
  cms: { title?: string; body?: string }[],
) {
  const byTitle = new Map(
    cms
      .filter((section) => section.title && section.body)
      .map((section) => [section.title!.trim().toLowerCase(), section.body!.trim()]),
  )
  return catalog.map((item) => {
    const cmsBody = byTitle.get(item.title.trim().toLowerCase())
    return {
      title: item.title,
      plain: cmsBody && cmsBody.length > item.body.length ? cmsBody : item.body,
    }
  })
}

export function pickFeatured(
  fromHome: ProjectCardData[],
  fromProjects: Array<ProjectCardData & { featured?: boolean | null; featuredOrder?: number | null }>,
  locale: Locale,
) {
  if (fromHome.length) return fromHome
  const flagged = fromProjects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
  if (flagged.length) return flagged
  if (fromProjects.length) {
    const bySlug = new Map(fromProjects.map((project) => [project.slug, project]))
    const ordered = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (project): project is NonNullable<typeof project> => Boolean(project),
    )
    return ordered.length ? ordered : fromProjects.slice(0, 5)
  }
  return catalogFeatured(locale)
}
