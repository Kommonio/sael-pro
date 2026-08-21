import type { Locale } from '@/i18n/config'
import type { Project } from '@/payload-types'
import { lexicalText } from '@/lib/richText'

export type CaseStudyView = {
  slug: string
  title: string
  year?: string
  role: string
  studio?: string
  client?: string
  location?: string
  authorship: 'authored' | 'collaborative' | 'contribution' | 'experiment'
  lede: string
  question?: string
  experience?: string
  system?: string
  whatChanged?: string
  climateHint?: string
  externalUrl?: string
  technologies?: string[]
  credits?: { name: string; role: string }[]
}

type Bilingual = { en: string; fr: string }

type CaseSeed = {
  slug: string
  year: string
  authorship: CaseStudyView['authorship']
  climateHint: string
  studio?: string
  externalUrl?: string
  technologies?: string[]
  title: Bilingual
  role: Bilingual
  client?: Bilingual
  location?: Bilingual
  lede: Bilingual
  question: Bilingual
  experience: Bilingual
  system: Bilingual
  whatChanged?: Bilingual
  credits: { name: string; role: Bilingual }[]
}

const CASES: CaseSeed[] = [
  {
    slug: 'azul-vivo',
    year: '2026–',
    authorship: 'authored',
    climateHint: 'sap',
    externalUrl: 'https://azulvivo.com',
    technologies: ['360°', 'VR', 'Fulldome', 'Field production'],
    title: { en: 'Azul Vivo', fr: 'Azul Vivo' },
    role: { en: 'Creator & Director', fr: 'Créateur et directeur' },
    location: { en: 'Seaflower Biosphere Reserve, Colombia', fr: 'Réserve de biosphère Seaflower, Colombie' },
    lede: {
      en: 'An immersive underwater documentary practice — 360° image, spatial sound, institutional VR and fulldome.',
      fr: 'Une pratique documentaire sous-marine immersive — image 360°, son spatial, RV institutionnelle et fulldome.',
    },
    question: {
      en: 'How does an immersive system influence the body — if we refuse to explain every encounter?',
      fr: 'Comment un système immersif influence-t-il le corps — si l’on refuse d’expliquer chaque rencontre ?',
    },
    experience: {
      en: 'Presence, the first work, was filmed in the Seaflower Biosphere Reserve around San Andrés and Providencia. Humans withdraw so that another presence — the ocean and its living systems — can emerge.\n\nForm: presence through absence. Experience: encounter the ocean as a living presence. Purpose: attachment can become care; care can become protection. The audience is allowed to encounter something before the system explains it.',
      fr: 'Presence, la première œuvre, a été filmée dans la réserve de biosphère Seaflower, autour de San Andrés et Providencia. Les humains se retirent pour qu’une autre présence — l’océan et ses systèmes vivants — puisse émerger.\n\nForme : la présence par l’absence. Expérience : rencontrer l’océan comme une présence vivante. Propos : l’attachement peut devenir soin ; le soin, protection. Le public a le droit de rencontrer avant que le système n’explique.',
    },
    system: {
      en: 'Artistic direction, field-production method, underwater capture system, visual language, post-production workflow, immersive presentation strategy, and companion software direction. Form, experience and purpose are held as one architecture — 360° image, spatial sound, institutional VR and fulldome.',
      fr: 'Direction artistique, méthode de production de terrain, système de captation sous-marine, langage visuel, flux de postproduction, stratégie de présentation immersive, et direction logicielle d’accompagnement. Forme, expérience et propos tiennent comme une seule architecture — image 360°, son spatial, RV institutionnelle et fulldome.',
    },
    whatChanged: {
      en: 'This is the clearest present-day convergence of image, systems, field method and authored immersive work.',
      fr: 'C’est la convergence la plus claire, aujourd’hui, de l’image, des systèmes, de la méthode de terrain et d’un travail immersif d’auteur.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator & Director', fr: 'Créateur et directeur' } }],
  },
  {
    slug: 'onmove',
    year: '2022–',
    authorship: 'authored',
    climateHint: 'moss',
    externalUrl: 'https://onmove.app',
    technologies: ['React', 'Node.js', 'PWA', 'MQTT', 'BLE', 'GPS'],
    title: { en: 'OnMove', fr: 'OnMove' },
    role: { en: 'Creator / Application & Platform Architect', fr: 'Créateur / architecte de la plateforme' },
    lede: {
      en: 'A platform for creating, managing and delivering location-aware immersive media — not an audio-guide app.',
      fr: 'Une plateforme pour créer, gérer et diffuser des médias immersifs sensibles au lieu — pas un audioguide.',
    },
    question: {
      en: 'How do you connect creator, content, cloud, location and participant as one relationship?',
      fr: 'Comment relier créateur, contenu, nuage, lieu et participant comme une seule relation ?',
    },
    experience: {
      en: 'A visitor walks a place. Content arrives because of where they are — GPS, beacons, maps — in the language they need, even when the network is poor.',
      fr: 'Un visiteur traverse un lieu. Le contenu arrive à cause de l’endroit — GPS, balises, cartes — dans la langue nécessaire, même quand le réseau est pauvre.',
    },
    system: {
      en: 'Authoring administration, multilingual content, media, beacons, publishing. Node backend, authenticated APIs, browser-first PWA delivery, offline caching, MQTT over WebSockets. The accomplishment is the chain, not a single frontend.',
      fr: 'Administration d’écriture, contenu multilingue, médias, balises, publication. Backend Node, API authentifiées, diffusion PWA d’abord navigateur, cache hors ligne, MQTT sur WebSockets. L’accomplissement est la chaîne, pas un seul frontend.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / architect', fr: 'Créateur / architecte' } }],
  },
  {
    slug: 'echoes',
    year: '2023–2024',
    authorship: 'authored',
    climateHint: 'clay',
    studio: 'Kommon.io',
    technologies: ['EmotiBit', 'EEG', 'Flutter', 'Firebase', 'Realtime'],
    title: { en: 'Echoes', fr: 'Echoes' },
    role: { en: 'Creator / System Architect', fr: 'Créateur / architecte de système' },
    lede: {
      en: 'Biometric middleware: how physiological signals move through a complete pipeline and become usable by realtime media.',
      fr: 'Intergiciel biométrique : comment des signaux physiologiques traversent une chaîne complète et deviennent utilisables par des médias temps réel.',
    },
    question: {
      en: 'What signals are actually coming from the participant, and how do we preserve their temporal and embodied meaning?',
      fr: 'Quels signaux viennent vraiment du participant, et comment préserver leur sens temporel et incarné ?',
    },
    experience: {
      en: 'A body is sensed. The media environment can listen — without turning the person into a joystick. Uncertainty is kept, not flattened into a fake cue.',
      fr: 'Un corps est mesuré. L’environnement média peut écouter — sans transformer la personne en manette. L’incertitude est gardée, pas aplatie en fausse cue.',
    },
    system: {
      en: 'Body → sensing hardware → firmware → device communication → mobile app → realtime/cloud transport → session aggregation → Windows client → external media. Specific transferred code/IP is not presented as current independent IP.',
      fr: 'Corps → capteurs → micrologiciel → communication → appli mobile → transport temps réel/nuage → agrégation de session → client Windows → média externe. Le code/IP transféré n’est pas présenté comme IP indépendante actuelle.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / system architect', fr: 'Créateur / architecte de système' } }],
  },
  {
    slug: 'man-who-planted-trees',
    year: '2025',
    authorship: 'contribution',
    climateHint: 'moss',
    studio: 'Supply + Demand',
    externalUrl: 'https://supply-demand.ca/en/man-who-planted-trees-immersive-tale',
    title: { en: 'The Man Who Planted Trees', fr: 'L’Homme qui plantait des arbres' },
    role: { en: 'Technical Architecture Design — Supply + Demand', fr: 'Conception de l’architecture technique — Supply + Demand' },
    client: { en: 'Canadian Museum of Nature', fr: 'Musée canadien de la nature' },
    lede: {
      en: 'A touring immersive exhibition. Official credit: Technical Architecture Design, Saël Simard.',
      fr: 'Une exposition immersive en tournée. Crédit officiel : conception de l’architecture technique, Saël Simard.',
    },
    question: {
      en: 'What architecture lets a touring forest-experience stay coherent for operators and visitors?',
      fr: 'Quelle architecture permet à une forêt en tournée de rester cohérente pour opérateurs et visiteurs ?',
    },
    experience: {
      en: 'Visitors move through forest-inspired scenography, interactive environments and scientific content. This is a Supply + Demand production, developed with the Canadian Museum of Nature, inspired by Frédéric Back and Jean Giono.',
      fr: 'Les visiteurs traversent une scénographie forestière, des environnements interactifs et un contenu scientifique. Production Supply + Demand, développée avec le Musée canadien de la nature, inspirée de Frédéric Back et Jean Giono.',
    },
    system: {
      en: 'Contributed to the systems architecture of the touring immersive exhibition as part of Supply + Demand’s technical team. Not an independently authored project.',
      fr: 'Contribution à l’architecture des systèmes de l’exposition immersive en tournée, au sein de l’équipe technique de Supply + Demand. Ce n’est pas un projet d’auteur indépendant.',
    },
    credits: [
      { name: 'Supply + Demand', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'Technical Architecture Design', fr: 'Conception de l’architecture technique' } },
    ],
  },
  {
    slug: 'viventi-mori',
    year: '2018–2019',
    authorship: 'collaborative',
    climateHint: 'earth',
    studio: 'Kommon Collective',
    technologies: ['TouchDesigner', 'Notch', 'Fabrication', 'Projection mapping'],
    title: { en: 'Viventi Mori', fr: 'Viventi Mori' },
    role: { en: 'Physical system / case design and fabrication — collaborative creator', fr: 'Système physique / conception et fabrication du coffre — créateur collaboratif' },
    location: { en: 'Presented at Pixelatl', fr: 'Présenté à Pixelatl' },
    lede: {
      en: 'A portable projection-mapping object: a skull, a suitcase, a meditation on life, death, creation and decay.',
      fr: 'Un objet de projection mapping portable : un crâne, une valise, une méditation sur la vie, la mort, la création et la décomposition.',
    },
    question: {
      en: 'Can a complete audiovisual world travel inside a handmade case?',
      fr: 'Un monde audiovisuel complet peut-il voyager dans un coffre fait à la main ?',
    },
    experience: {
      en: 'The piece uses a human skull as a projection surface, rooted in Mexican visual culture, cycling through creation, nature, psyche and beyond. It is both an object and an audiovisual experience.',
      fr: 'L’œuvre utilise un crâne comme surface de projection, ancrée dans la culture visuelle mexicaine, et traverse création, nature, psyché et au-delà. C’est à la fois un objet et une expérience audiovisuelle.',
    },
    system: {
      en: 'Reinforced wooden case built from scratch by Saël: steel bearings, pneumatic opening, rear storage, two internal speakers, three pico-projector mounts, Kinect mount, velvet interior. Collaborators: Sylvie Béraud, Alexandre DeBavelaere / Alex Vlair, Bobby Léon.',
      fr: 'Coffre de bois renforcé construit de zéro par Saël : roulements, ouverture pneumatique, rangement arrière, deux haut-parleurs internes, trois supports de pico-projecteurs, support Kinect, velours. Collaborateurs : Sylvie Béraud, Alexandre DeBavelaere / Alex Vlair, Bobby Léon.',
    },
    credits: [
      { name: 'Sylvie Béraud', role: { en: 'Illustrations / design', fr: 'Illustrations / design' } },
      { name: 'Alexandre DeBavelaere / Alex Vlair', role: { en: 'Animation / 3D / Notch', fr: 'Animation / 3D / Notch' } },
      { name: 'Bobby Léon', role: { en: 'Sound', fr: 'Son' } },
      { name: 'Saël Simard', role: { en: 'Physical system / case', fr: 'Système physique / coffre' } },
    ],
  },
  {
    slug: 'omega-protocol',
    year: '2023',
    authorship: 'authored',
    climateHint: 'clay',
    title: { en: 'Omega Protocol', fr: 'Omega Protocol' },
    role: { en: 'Creator / Producer', fr: 'Créateur / producteur' },
    location: { en: 'Mother of the Nation Festival, Abu Dhabi', fr: 'Mother of the Nation Festival, Abou Dabi' },
    lede: {
      en: 'A multiplayer immersive VR game at public festival scale — science-fiction combat with a teleportation system.',
      fr: 'Un jeu VR immersif multijoueur à l’échelle d’un festival — combat de science-fiction avec un système de téléportation.',
    },
    question: {
      en: 'Can authored entertainment hold at international public scale, not only as technical integration?',
      fr: 'Un divertissement d’auteur peut-il tenir à l’échelle publique internationale, et pas seulement comme intégration technique ?',
    },
    experience: {
      en: 'Players are transported to the frontline of an alien battle. Press coverage described combat using an innovative teleportation system at Mother of the Nation Festival 2023.',
      fr: 'Les joueurs sont transportés au front d’une bataille extra-terrestre. La presse a décrit un combat avec un système de téléportation au Mother of the Nation Festival 2023.',
    },
    system: {
      en: 'Location-based multiplayer VR. Hardware, tracking, spectator layer and formal partner credits to be recovered from production archives before a deeper technical write-up.',
      fr: 'VR locative multijoueur. Matériel, tracking, couche spectateurs et crédits partenaires formels à récupérer dans les archives de production avant un texte technique plus profond.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / Producer', fr: 'Créateur / producteur' } }],
  },
  {
    slug: 'versus',
    year: '2022',
    authorship: 'authored',
    climateHint: 'clay',
    title: { en: 'Versus', fr: 'Versus' },
    role: { en: 'Creator / Producer', fr: 'Créateur / producteur' },
    client: { en: 'LINKVIVA', fr: 'LINKVIVA' },
    location: { en: 'Mother of the Nation Festival, Abu Dhabi', fr: 'Mother of the Nation Festival, Abou Dabi' },
    lede: {
      en: 'A multiplayer immersive VR experience — the year before Omega Protocol, in the same festival lineage.',
      fr: 'Une expérience VR immersive multijoueur — l’année avant Omega Protocol, dans la même lignée de festival.',
    },
    question: {
      en: 'What does a year of iteration do to a location-based VR practice?',
      fr: 'Que fait une année d’itération à une pratique de VR locative ?',
    },
    experience: {
      en: 'Promoted in the 2022 Thrill Zone at Mother of the Nation. Gameplay and technical design should be recovered from archives rather than reconstructed from marketing fragments.',
      fr: 'Présenté dans la Thrill Zone 2022 de Mother of the Nation. Le gameplay et le design technique doivent venir des archives, pas d’un marketing reconstruit.',
    },
    system: {
      en: 'Paired with Omega Protocol as a two-year evolution of location-based VR. Precise hardware and player count pending archive recovery.',
      fr: 'À jumeler avec Omega Protocol comme une évolution sur deux ans de la VR locative. Matériel et nombre de joueurs précis en attente des archives.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / Producer', fr: 'Créateur / producteur' } }],
  },
  {
    slug: 'villa-hublot',
    year: '2022',
    authorship: 'contribution',
    climateHint: 'earth',
    studio: 'Bakuza Events',
    title: { en: 'Villa Hublot', fr: 'Villa Hublot' },
    role: { en: 'System Designer — Bakuza Events', fr: 'Concepteur de systèmes — Bakuza Events' },
    client: { en: 'Hublot — FIFA World Cup, Doha', fr: 'Hublot — Coupe du monde de la FIFA, Doha' },
    location: { en: 'Doha, Qatar', fr: 'Doha, Qatar' },
    lede: {
      en: 'Interactive multimedia systems for Hublot’s World Cup hospitality environment. Not an independently authored project.',
      fr: 'Systèmes multimédias interactifs pour l’environnement d’hospitalité Hublot à la Coupe du monde. Pas un projet d’auteur indépendant.',
    },
    question: {
      en: 'How do luxury branding and sensory immersion share one technical body?',
      fr: 'Comment le luxe de marque et l’immersion sensorielle partagent-ils un même corps technique ?',
    },
    experience: {
      en: 'A brand hospitality environment at the 2022 World Cup. Visitors moved through an interactive multimedia villa produced by Bakuza Events for Hublot.',
      fr: 'Un environnement d’hospitalité de marque à la Coupe du monde 2022. Les visiteurs traversaient une villa multimédia interactive produite par Bakuza Events pour Hublot.',
    },
    system: {
      en: 'System design for interactive multimedia systems combining luxury branding and sensory immersion, as part of the Bakuza Events team.',
      fr: 'Conception de systèmes pour des dispositifs multimédias interactifs alliant image de luxe et immersion sensorielle, au sein de l’équipe Bakuza Events.',
    },
    credits: [
      { name: 'Bakuza Events', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'System Designer', fr: 'Concepteur de systèmes' } },
    ],
  },
  {
    slug: 'sensory-odyssey',
    year: '2026',
    authorship: 'contribution',
    climateHint: 'sap',
    studio: 'Supply + Demand',
    title: { en: 'Sensory Odyssey / Vivid', fr: 'Sensory Odyssey / Vivid' },
    role: { en: 'System Designer — Supply + Demand', fr: 'Concepteur de systèmes — Supply + Demand' },
    lede: {
      en: 'North American deployment of a multisensory touring exhibition. Content by Sensory Odyssey Studio. I did not create Sensory Odyssey.',
      fr: 'Déploiement nord-américain d’une exposition multisensorielle en tournée. Contenu : Sensory Odyssey Studio. Je n’ai pas créé Sensory Odyssey.',
    },
    question: {
      en: 'What does it take to make a complex multisensory tour actually run?',
      fr: 'Que faut-il pour qu’une tournée multisensorielle complexe tienne vraiment ?',
    },
    experience: {
      en: 'At the California Academy of Sciences the adaptation is presented as Vivid: Immerse Your Senses. Original content: Sensory Odyssey Studio. North American tour co-produced by Supply + Demand.',
      fr: 'À la California Academy of Sciences, l’adaptation s’appelle Vivid : Immerse Your Senses. Contenu original : Sensory Odyssey Studio. Tournée nord-américaine coproduite par Supply + Demand.',
    },
    system: {
      en: 'System design on the Supply + Demand side of a Modular Exhibit System deployment. Exact cities and architecture details remain for confirmation.',
      fr: 'Conception de systèmes du côté Supply + Demand d’un déploiement Modular Exhibit System. Villes et détails d’architecture exacts restent à confirmer.',
    },
    credits: [
      { name: 'Sensory Odyssey Studio', role: { en: 'Content / original production', fr: 'Contenu / production originale' } },
      { name: 'Supply + Demand', role: { en: 'North American co-production', fr: 'Coproduction nord-américaine' } },
      { name: 'Saël Simard', role: { en: 'System Designer', fr: 'Concepteur de systèmes' } },
    ],
  },
  {
    slug: 'le-repaire',
    year: '2026',
    authorship: 'contribution',
    climateHint: 'earth',
    studio: 'Supply + Demand',
    title: { en: 'Le Repaire (secret secret)', fr: 'Le Repaire (secret secret)' },
    role: { en: 'System Designer / Integrator — Supply + Demand', fr: 'Concepteur de systèmes / intégrateur — Supply + Demand' },
    client: { en: 'Village historique de Val-Jalbert', fr: 'Village historique de Val-Jalbert' },
    lede: {
      en: 'An immersive journey for children through historic pulp railway cars. Studio production; my role is systems and integration.',
      fr: 'Un parcours immersif pour enfants dans d’authentiques wagons de pulpe. Production de studio ; mon rôle est systèmes et intégration.',
    },
    question: {
      en: 'How do authentic industrial objects become portals without losing the site?',
      fr: 'Comment des objets industriels authentiques deviennent-ils des portails sans perdre le lieu ?',
    },
    experience: {
      en: 'Children roughly 6–12 travel through pulp bales and interactive installations. Concept, script, scenography, media and art direction are credited to Supply + Demand as a studio.',
      fr: 'Des enfants d’environ 6 à 12 ans traversent ballots de pulpe et installations interactives. Concept, récit, scénographie, médias et direction artistique sont crédités à Supply + Demand comme studio.',
    },
    system: {
      en: 'System designer and integrator within the Supply + Demand project team. This page does not imply overall creative authorship.',
      fr: 'Concepteur de systèmes et intégrateur au sein de l’équipe Supply + Demand. Cette page n’implique pas une autrice ou un auteur créatif global.',
    },
    credits: [
      { name: 'Supply + Demand', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'System Designer / Integrator', fr: 'Concepteur de systèmes / intégrateur' } },
    ],
  },
]

export function catalogCaseStudy(slug: string, locale: Locale): CaseStudyView | null {
  const seed = CASES.find((item) => item.slug === slug)
  if (!seed) return null
  return {
    slug: seed.slug,
    year: seed.year,
    authorship: seed.authorship,
    climateHint: seed.climateHint,
    studio: seed.studio,
    externalUrl: seed.externalUrl,
    technologies: seed.technologies,
    title: seed.title[locale],
    role: seed.role[locale],
    client: seed.client?.[locale],
    location: seed.location?.[locale],
    lede: seed.lede[locale],
    question: seed.question[locale],
    experience: seed.experience[locale],
    system: seed.system[locale],
    whatChanged: seed.whatChanged?.[locale],
    credits: seed.credits.map((credit) => ({ name: credit.name, role: credit.role[locale] })),
  }
}

function preferCopy(cms: string, fallback?: string) {
  if (!cms) return fallback
  if (!fallback) return cms
  return cms.length >= fallback.length ? cms : fallback
}

export function mergeCaseStudy(slug: string, locale: Locale, cms: Project | null): CaseStudyView | null {
  const fallback = catalogCaseStudy(slug, locale)
  if (!cms && !fallback) return null
  const credits = (cms?.credits || [])
    .map((credit) => ({ name: credit.name, role: credit.role }))
    .filter((credit): credit is { name: string; role: string } => Boolean(credit.name && credit.role))
  return {
    slug,
    title: cms?.title || fallback?.title || slug,
    year: cms?.year || fallback?.year,
    role: cms?.role || fallback?.role || '',
    studio: cms?.studio || fallback?.studio,
    client: cms?.client || fallback?.client,
    location: cms?.location || fallback?.location,
    authorship: cms?.authorship || fallback?.authorship || 'authored',
    lede: preferCopy(cms?.lede || '', fallback?.lede) || '',
    question: preferCopy(cms?.question || '', fallback?.question),
    experience: preferCopy(lexicalText(cms?.experience), fallback?.experience),
    system: preferCopy(lexicalText(cms?.system), fallback?.system),
    whatChanged: preferCopy(lexicalText(cms?.whatChanged), fallback?.whatChanged),
    climateHint: cms?.climateHint || fallback?.climateHint,
    externalUrl: cms?.externalUrl || fallback?.externalUrl,
    technologies: cms?.technologies?.filter(Boolean) || fallback?.technologies,
    credits: credits.length ? credits : fallback?.credits,
  }
}
