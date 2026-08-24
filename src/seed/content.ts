import { textToLexical } from '@/lib/richText'

export const site = {
  name: 'Saël Simard',
  email: 'hello@sael.pro',
  locationLine: { en: 'Montréal', fr: 'Montréal' },
  thesis: {
    en: 'I design the conditions for an experience — from image to system.',
    fr: 'Je conçois les conditions d’une expérience — de l’image au système.',
  },
  seoTitle: { en: 'Saël Simard', fr: 'Saël Simard' },
  seoDescription: {
    en: 'System architect, creative technologist and immersive-media creator. Authored work and selected professional contributions.',
    fr: 'Architecte de systèmes, technologue créatif et créateur de médias immersifs. Œuvres d’auteur et contributions professionnelles choisies.',
  },
}

export const home = {
  heroName: 'Saël Simard',
  heroLine: {
    en: 'I design the conditions for an experience — images, software, systems and space, as one encounter.',
    fr: 'Je conçois les conditions d’une expérience — images, logiciels, systèmes et espaces, comme une seule rencontre.',
  },
  practiceTitle: { en: 'Practice', fr: 'Pratique' },
  practiceSteps: [
    {
      label: { en: 'Experience', fr: 'Expérience' },
      text: {
        en: 'What should a person notice, remember, or do? The medium comes after.',
        fr: 'Que doit remarquer, retenir ou faire une personne ? Le médium vient après.',
      },
    },
    {
      label: { en: 'System', fr: 'Système' },
      text: {
        en: 'The relationships between subsystems — signal, software, space, operators.',
        fr: 'Les relations entre sous-systèmes — signal, logiciel, espace, opérateurs.',
      },
    },
    {
      label: { en: 'Interface', fr: 'Interface' },
      text: {
        en: 'Give technology a job, then let it disappear.',
        fr: 'Donner un métier à la technique, puis la laisser disparaître.',
      },
    },
    {
      label: { en: 'Deployment', fr: 'Déploiement' },
      text: {
        en: 'If it cannot install, tour, reset and be maintained, it is not finished.',
        fr: 'Si ça ne s’installe pas, ne voyage pas, ne se réinitialise pas et ne se maintient pas, ce n’est pas fini.',
      },
    },
  ],
  contributionsTitle: { en: 'Selected professional contributions', fr: 'Contributions professionnelles choisies' },
  contributionsIntro: {
    en: 'I design and integrate multimedia systems at Supply + Demand. The projects below are studio productions to which I contributed as part of multidisciplinary teams.',
    fr: 'Je conçois et intègre des systèmes multimédias chez Supply + Demand. Les projets ci-dessous sont des productions de studio auxquelles j’ai contribué au sein d’équipes multidisciplinaires.',
  },
  labTitle: { en: 'Lab', fr: 'Labo' },
  closeLine: {
    en: 'If you want to build an experience that has to actually hold — write me.',
    fr: 'Si vous voulez construire une expérience qui doit vraiment tenir — écrivez-moi.',
  },
}

export const practice = {
  title: {
    en: 'How a thing becomes inevitable.',
    fr: 'Comment une chose devient inévitable.',
  },
  intro: {
    en: 'This is not a services page. It is the grammar of the work: concept, software, realtime media, AV/IT architecture, fabrication, field, installation, operation — held as one encounter.',
    fr: 'Ce n’est pas une page de services. C’est la grammaire du travail : concept, logiciel, média temps réel, architecture AV/IT, fabrication, terrain, installation, opération — tenus comme une seule rencontre.',
  },
  sections: [
    {
      title: { en: 'Experience', fr: 'Expérience' },
      body: {
        en: 'What should a person experience, notice, understand, remember, or do? The medium comes after. Explanation too.',
        fr: 'Que doit vivre, remarquer, comprendre, retenir ou faire une personne ? Le médium vient après. L’explication aussi.',
      },
    },
    {
      title: { en: 'System', fr: 'Système' },
      body: {
        en: 'The interesting object is the chain: authoring, place, body, media, operators. Dependencies, interfaces, failure modes, flows.',
        fr: 'L’objet intéressant est la chaîne : écriture, lieu, corps, média, opérateurs. Dépendances, interfaces, modes de panne, flux.',
      },
    },
    {
      title: { en: 'Interface', fr: 'Interface' },
      body: {
        en: 'Give technology a job, then let it disappear. Complexity underneath; clarity at the surface.',
        fr: 'Donner un métier à la technique, puis la laisser disparaître. La complexité en dessous ; la clarté à la surface.',
      },
    },
    {
      title: { en: 'Deployment', fr: 'Déploiement' },
      body: {
        en: 'If it cannot install, tour, reset and be maintained, it is not finished.',
        fr: 'Si ça ne s’installe pas, ne voyage pas, ne se réinitialise pas et ne se maintient pas, ce n’est pas fini.',
      },
    },
    {
      title: { en: 'Experience first', fr: 'L’expérience d’abord' },
      body: {
        en: 'The starting question is never the tool. What should a person experience — notice, understand, remember, do? Only then does the medium become a design decision. The audience is allowed to encounter something before the system explains it.',
        fr: 'La question de départ n’est jamais l’outil. Que doit vivre une personne — remarquer, comprendre, retenir, faire ? Ensuite seulement le médium devient une décision. Le public a le droit de rencontrer avant que le système n’explique.',
      },
    },
    {
      title: { en: 'Interaction is not input', fr: 'Interagir n’est pas entrer une donnée' },
      body: {
        en: 'Skepticism toward interaction-as-spectacle: participant moves, particles move. A more characteristic act is to observe, discover, remember, affect a shared system, reveal a relationship, let physical context alter digital behavior.',
        fr: 'Méfiance envers l’interaction-spectacle : le participant bouge, les particules bougent. Une interaction plus juste observe, découvre, retient, affecte un système partagé, révèle une relation, laisse le lieu changer le comportement numérique.',
      },
    },
    {
      title: { en: 'Constraints as material', fr: 'Les contraintes comme matière' },
      body: {
        en: 'Venue, hardware, bandwidth, safety, install time, operators, touring. The goal is not to protect a concept from reality. It is to find the version that becomes stronger because it understands reality.',
        fr: 'Lieu, matériel, bande passante, sécurité, temps d’install, opérateurs, tournée. Le but n’est pas de protéger un concept contre le réel. C’est de trouver la version qui devient plus forte parce qu’elle le comprend.',
      },
    },
    {
      title: { en: 'What must remain true', fr: 'Ce qui doit rester vrai' },
      body: {
        en: 'Define the rules that cannot be compromised — feeling, perspective, safety, clarity. Every subsystem is judged against the same experiential objective, whether the decision is artistic or technical.',
        fr: 'Définir ce qui ne se négocie pas — effet, perspective, sécurité, clarté. Chaque sous-système se juge à la même règle d’expérience, qu’il soit artistique ou technique.',
      },
    },
    {
      title: { en: 'Follow the question', fr: 'Suivre la question' },
      body: {
        en: 'If understanding the problem requires code, optics, 3D printing, networking, underwater capture or projection geometry, I learn enough of the adjacent discipline to decide and collaborate without losing the coherence of the experience.',
        fr: 'Si comprendre le problème demande du code, de l’optique, de l’impression 3D, un réseau, une captation sous-marine ou une géométrie de projection, j’apprends assez de la discipline voisine pour décider et collaborer sans casser la cohérence.',
      },
    },
    {
      title: { en: 'The whole relationship', fr: 'Toute la relation' },
      body: {
        en: 'Not an isolated deliverable. OnMove: creator → content → cloud → location → participant. Echoes: body → sensor → firmware → app → transport → media. The strength is the chain.',
        fr: 'Pas un livrable isolé. OnMove : créateur → contenu → nuage → lieu → participant. Echoes : corps → capteur → micrologiciel → appli → transport → média. La force est la chaîne.',
      },
    },
    {
      title: { en: 'Prototype to think', fr: 'Le prototype comme pensée' },
      body: {
        en: 'Partial systems, printed parts, field rigs, projection tests, temporary apps. I build in order to discover what the final system needs to be — observe, frame, prototype, test, learn, restructure.',
        fr: 'Systèmes partiels, pièces imprimées, rigs de terrain, tests de projection, applis temporaires. Je construis pour découvrir ce que le système final doit être — observe, cadre, prototype, teste, apprends, restructure.',
      },
    },
    {
      title: { en: 'Precision without rigidity', fr: 'Précision sans rigidité' },
      body: {
        en: 'Engineering requires precision; artistic work requires discovery; field work requires adaptation. The system should be exact about what can be known, and flexible about what cannot. Uncertainty is kept, not flattened into a fake cue.',
        fr: 'L’ingénierie exige la précision ; le travail artistique, la découverte ; le terrain, l’adaptation. Le système doit être exact sur ce qui peut se connaître, et souple sur ce qui ne peut pas. L’incertitude se préserve, elle ne se déguise pas en cue.',
      },
    },
    {
      title: { en: 'Everyone around the project', fr: 'Tout le monde autour du projet' },
      body: {
        en: 'Visitor, curator, technician, operator, stage manager, maintenance. A public experience that is miserable to install, diagnose, tour or reset is not fully designed.',
        fr: 'Visiteur, commissaire, technicien, opérateur, régisseur, maintenance. Une expérience publique misérable à installer, diagnostiquer, tourner ou réinitialiser n’est pas entièrement conçue.',
      },
    },
    {
      title: { en: 'No gimmick', fr: 'Pas de gadget' },
      body: {
        en: 'The right question is not “is it cool?” Does it belong? What does it reveal? Does it increase presence, or fragment attention?',
        fr: 'La bonne question n’est pas « est-ce cool ? ». Est-ce que ça appartient ? Qu’est-ce que ça révèle ? Est-ce que ça augmente la présence, ou est-ce que ça fragmente l’attention ?',
      },
    },
  ],
}

export const about = {
  title: {
    en: 'System architect. Creative technologist. Immersive-media creator.',
    fr: 'Architecte de systèmes. Technologue créatif. Créateur de médias immersifs.',
  },
  currentRole: {
    en: 'System Architect at Supply + Demand (since January 2026). Based in Montréal. Independent practice as Kommon.io since 2017.',
    fr: 'Architecte de systèmes chez Supply + Demand (depuis janvier 2026). Basé à Montréal. Pratique indépendante via Kommon.io depuis 2017.',
  },
  bio: {
    en: 'The practice crosses boundaries that are usually separated: concept, experience design, software, realtime media, AV/IT architecture, hardware, fabrication, field production, installation, operation.\n\nI am not primarily a UI designer, conventional web developer, AV installer, filmmaker or software engineer — though I have credible practice in all of those. The distinctive work is connecting them into coherent experiential systems.\n\nThe career moved from cinematography at UQAM, through interactive environments and touring systems, into authored immersive worlds. The through-line is the same: design what has to exist — technically, physically, spatially and perceptually — for an experience to feel inevitable.',
    fr: 'La pratique traverse des frontières habituellement séparées : concept, design d’expérience, logiciel, médias temps réel, architecture AV/IT, matériel, fabrication, production de terrain, installation, opération.\n\nJe ne suis pas d’abord designer d’interface, développeur web conventionnel, intégrateur AV, cinéaste ou ingénieur logiciel — même si j’ai une pratique crédible dans chacun de ces domaines. Le travail distinctif est de les relier en systèmes d’expérience cohérents.\n\nLe parcours est passé de la cinématographie à l’UQAM, aux environnements interactifs et aux systèmes en tournée, jusqu’à des mondes immersifs d’auteur. Le fil est le même : concevoir ce qui doit exister — techniquement, physiquement, spatialement et perceptuellement — pour qu’une expérience paraisse inévitable.',
  },
  phases: [
    {
      title: { en: 'Image', fr: 'Image' },
      body: {
        en: 'Communication and cinematography at UQAM. Framing, narrative, documentary instinct. The image is still the reason the system exists.',
        fr: 'Communication et cinématographie à l’UQAM. Cadre, récit, instinct documentaire. L’image reste la raison d’être du système.',
      },
    },
    {
      title: { en: 'Environments', fr: 'Environnements' },
      body: {
        en: 'Projection, realtime media, objects as interfaces, bodies moving through architecture.',
        fr: 'Projection, médias temps réel, objets comme interfaces, corps qui traversent l’architecture.',
      },
    },
    {
      title: { en: 'Systems', fr: 'Systèmes' },
      body: {
        en: 'Circo de Bakuza, TKNL, Kommon.io, Supply + Demand. Signal topology, media servers, networks, operators, touring, maintainability.',
        fr: 'Circo de Bakuza, TKNL, Kommon.io, Supply + Demand. Topologie du signal, serveurs média, réseaux, opérateurs, tournée, maintenabilité.',
      },
    },
    {
      title: { en: 'Authored worlds', fr: 'Mondes d’auteur' },
      body: {
        en: 'Azul Vivo, OnMove, Echoes, location-based VR. Applications as experiential infrastructure. Immersive work that begins from presence, not from a stack.',
        fr: 'Azul Vivo, OnMove, Echoes, VR locative. Les applications comme infrastructure d’expérience. Un travail immersif qui part de la présence, pas d’une pile technique.',
      },
    },
  ],
  capabilities: [
    {
      domain: { en: 'Immersive media', fr: 'Médias immersifs' },
      note: {
        en: 'VR, 360°, fulldome, realtime playback, spatial image.',
        fr: 'RV, 360°, fulldome, lecture temps réel, image spatiale.',
      },
    },
    {
      domain: { en: 'Applications', fr: 'Applications' },
      note: {
        en: 'Location-aware platforms, PWAs, realtime data, authoring tools.',
        fr: 'Plateformes sensibles au lieu, PWA, données temps réel, outils d’écriture.',
      },
    },
    {
      domain: { en: 'AV / systems', fr: 'AV / systèmes' },
      note: {
        en: 'Video servers, AV-over-IP, show control, monitoring, virtualization.',
        fr: 'Serveurs vidéo, AV-over-IP, show control, supervision, virtualisation.',
      },
    },
    {
      domain: { en: 'Physical', fr: 'Physique' },
      note: {
        en: 'Fabrication, sensors, custom interfaces, field capture, installation.',
        fr: 'Fabrication, capteurs, interfaces sur mesure, captation de terrain, installation.',
      },
    },
  ],
  education: [
    { place: 'UQAM', detail: { en: 'B.A. Communication — cinematography', fr: 'B.A. Communication — cinématographie' }, years: '2009–2012' },
    { place: 'UQAM / Tunis', detail: { en: 'Arabic language and culture', fr: 'Langue et culture arabes' }, years: '2012–2013' },
    { place: 'SAT', detail: { en: 'TouchDesigner', fr: 'TouchDesigner' }, years: '2018' },
    { place: 'Disguise, New York', detail: { en: 'D3 Manager', fr: 'D3 Manager' }, years: '2019' },
  ],
}

export const header = {
  topologyLabel: { en: 'Score', fr: 'Partition' },
  nav: [
    { href: '/work', label: { en: 'Work', fr: 'Œuvre' } },
    { href: '/practice', label: { en: 'Practice', fr: 'Pratique' } },
    { href: '/lab', label: { en: 'Lab', fr: 'Labo' } },
    { href: '/about', label: { en: 'About', fr: 'À propos' } },
    { href: '/contact', label: { en: 'Contact', fr: 'Contact' } },
  ],
}

export const footer = {
  note: {
    en: 'I design the conditions for an experience — from image to system.',
    fr: 'Je conçois les conditions d’une expérience — de l’image au système.',
  },
  contactLabel: { en: 'Write', fr: 'Écrire' },
}

export const contact = {
  title: { en: 'Write me.', fr: 'Écrivez-moi.' },
  intro: {
    en: 'For collaborations, systems, installations, and work that has to hold in the real.',
    fr: 'Pour des collaborations, des systèmes, des installations, et un travail qui doit tenir dans le réel.',
  },
  email: 'hello@sael.pro',
  availability: {
    en: 'Montréal. I read everything.',
    fr: 'Montréal. Je lis tout.',
  },
  submitLabel: { en: 'Send', fr: 'Envoyer' },
  successMessage: { en: 'Received. I will write back.', fr: 'Reçu. Je vous écrirai.' },
}

export const projects = [
  {
    slug: 'azul-vivo',
    year: '2026–',
    featured: true,
    featuredOrder: 1,
    landingPosition: 'primary',
    authorship: 'authored',
    tier: 'a',
    verification: 'needs-media',
    climateHint: 'sap',
    tags: ['authored', 'immersive'],
    externalUrl: 'https://azulvivo.com',
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
    technologies: ['360°', 'VR', 'Fulldome', 'Field production'],
    credits: [{ name: 'Saël Simard', role: { en: 'Creator & Director', fr: 'Créateur et directeur' } }],
  },
  {
    slug: 'onmove',
    year: '2022–',
    featured: true,
    featuredOrder: 3,
    landingPosition: 'secondary',
    authorship: 'authored',
    tier: 'a',
    verification: 'needs-media',
    climateHint: 'moss',
    tags: ['authored', 'software', 'interactive'],
    externalUrl: 'https://onmove.app',
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
    whatChanged: {
      en: 'Applications became experiential infrastructure — connective tissue between participant, place and institution.',
      fr: 'Les applications sont devenues une infrastructure d’expérience — un tissu entre participant, lieu et institution.',
    },
    technologies: ['React', 'Node.js', 'PWA', 'MQTT', 'BLE', 'GPS'],
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / architect', fr: 'Créateur / architecte' } }],
  },
  {
    slug: 'echoes',
    year: '2023–2024',
    featured: false,
    featuredOrder: 8,
    authorship: 'authored',
    tier: 'a',
    verification: 'verified',
    heroTreatment: 'typographic',
    climateHint: 'clay',
    tags: ['authored', 'systems', 'interactive'],
    title: { en: 'Echoes', fr: 'Echoes' },
    role: { en: 'Creator / System Architect', fr: 'Créateur / architecte de système' },
    studio: 'Kommon.io',
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
      en: 'Body → sensing hardware → firmware → device communication → mobile app → realtime/cloud transport → session aggregation → Windows client → external media. EmotiBit, EEG research, Flutter, Firebase, encrypted transport. Specific transferred code/IP is not presented as current independent IP.',
      fr: 'Corps → capteurs → micrologiciel → communication → appli mobile → transport temps réel/nuage → agrégation de session → client Windows → média externe. EmotiBit, recherche EEG, Flutter, Firebase, transport chiffré. Le code/IP transféré n’est pas présenté comme IP indépendante actuelle.',
    },
    whatChanged: {
      en: 'It inverted a later question in Azul Vivo: Echoes asked how the body influences a system. Azul Vivo asks how a system influences the body.',
      fr: 'Cela a inversé une question plus tard, dans Azul Vivo : Echoes demandait comment le corps influence un système. Azul Vivo demande comment un système influence le corps.',
    },
    technologies: ['EmotiBit', 'EEG', 'Flutter', 'Firebase', 'Realtime'],
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / system architect', fr: 'Créateur / architecte de système' } }],
  },
  {
    slug: 'man-who-planted-trees',
    year: '2025',
    featured: true,
    featuredOrder: 2,
    authorship: 'contribution',
    tier: 'b',
    verification: 'needs-media',
    climateHint: 'moss',
    tags: ['systems', 'immersive'],
    externalUrl: 'https://supply-demand.ca/en/man-who-planted-trees-immersive-tale',
    title: { en: 'The Man Who Planted Trees', fr: 'L’Homme qui plantait des arbres' },
    role: { en: 'Technical Architecture Design — Supply + Demand', fr: 'Conception de l’architecture technique — Supply + Demand' },
    studio: 'Supply + Demand',
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
      en: 'Visitors move through forest-inspired scenography, interactive environments and scientific content. The landscape can be transformed by participation. This is a Supply + Demand production, developed with the Canadian Museum of Nature, inspired by Frédéric Back and Jean Giono.',
      fr: 'Les visiteurs traversent une scénographie forestière, des environnements interactifs et un contenu scientifique. Le paysage peut se transformer par la participation. Production Supply + Demand, développée avec le Musée canadien de la nature, inspirée de Frédéric Back et Jean Giono.',
    },
    system: {
      en: 'Contributed to the systems architecture of the touring immersive exhibition as part of Supply + Demand’s technical team. Not an independently authored project.',
      fr: 'Contribution à l’architecture des systèmes de l’exposition immersive en tournée, au sein de l’équipe technique de Supply + Demand. Ce n’est pas un projet d’auteur indépendant.',
    },
    whatChanged: {
      en: 'A public, official credit for technical architecture on a major cultural tour — systems work at the scale of an institution.',
      fr: 'Un crédit public et officiel d’architecture technique sur une grande tournée culturelle — le travail de systèmes à l’échelle d’une institution.',
    },
    credits: [
      { name: 'Supply + Demand', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'Technical Architecture Design', fr: 'Conception de l’architecture technique' } },
    ],
  },
  {
    slug: 'viventi-mori',
    year: '2018–2019',
    featured: true,
    featuredOrder: 5,
    authorship: 'collaborative',
    tier: 'a',
    verification: 'needs-media',
    climateHint: 'earth',
    tags: ['authored', 'immersive', 'interactive'],
    title: { en: 'Viventi Mori', fr: 'Viventi Mori' },
    role: { en: 'Physical system / case design and fabrication — collaborative creator', fr: 'Système physique / conception et fabrication du coffre — créateur collaboratif' },
    studio: 'Kommon Collective',
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
      en: 'Reinforced wooden case built from scratch by Saël: steel bearings, pneumatic opening, rear storage, two internal speakers, three pico-projector mounts, Kinect mount, velvet interior, alternate object mount. Collaborators: Sylvie Béraud (illustrations), Alexandre DeBavelaere / Alex Vlair (animation / 3D / Notch), Bobby Léon (sound).',
      fr: 'Coffre de bois renforcé construit de zéro par Saël : roulements, ouverture pneumatique, rangement arrière, deux haut-parleurs internes, trois supports de pico-projecteurs, support Kinect, velours, objet interchangeable. Collaborateurs : Sylvie Béraud (illustrations), Alexandre DeBavelaere / Alex Vlair (animation / 3D / Notch), Bobby Léon (son).',
    },
    whatChanged: {
      en: 'An early signature: the physical system is not a container for the art. It is part of the art.',
      fr: 'Une signature précoce : le système physique n’est pas un contenant pour l’art. Il en fait partie.',
    },
    technologies: ['TouchDesigner', 'Notch', 'Fabrication', 'Projection mapping'],
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
    featured: true,
    featuredOrder: 4,
    authorship: 'authored',
    tier: 'a',
    verification: 'verified',
    heroTreatment: 'typographic',
    climateHint: 'clay',
    tags: ['authored', 'immersive', 'interactive'],
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
      en: 'Location-based multiplayer VR presented as a public-festival installation. The documented experience combines science-fiction combat with a teleportation mechanic; hardware and partner details not supported by the available production record are deliberately omitted.',
      fr: 'VR locative multijoueur présentée comme installation de festival public. L’expérience documentée combine combat de science-fiction et mécanique de téléportation ; les détails de matériel et de partenaires non étayés par les archives disponibles sont volontairement omis.',
    },
    whatChanged: {
      en: 'Proof that the authored practice includes entertainment at civic scale — not only cultural installation.',
      fr: 'La preuve que la pratique d’auteur inclut le divertissement à l’échelle civique — pas seulement l’installation culturelle.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / Producer', fr: 'Créateur / producteur' } }],
  },
  {
    slug: 'versus',
    year: '2022',
    featured: false,
    featuredOrder: 9,
    authorship: 'authored',
    tier: 'a',
    verification: 'needs-media',
    climateHint: 'clay',
    tags: ['authored', 'immersive', 'interactive'],
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
      en: 'Versus occupied the 2022 Thrill Zone as two mirrored VR rooms. The plan frames entry portals, wall-scale player views, spectator displays and an exterior operator desk as a single public-facing encounter.',
      fr: 'Versus occupait la Thrill Zone 2022 sous la forme de deux salles VR en miroir. Le plan réunit portails d’entrée, vues murales des joueurs, écrans spectateurs et poste d’opération extérieur en une seule rencontre publique.',
    },
    system: {
      en: 'Two adjacent play rooms share a repeatable footprint and visible operating edge. Each room combines tracked play space, a headset entry portal, a wall-scale display, overhead spectator monitors and an exterior control position; the mirrored plan supports parallel throughput and reset.',
      fr: 'Deux salles de jeu adjacentes partagent une empreinte répétable et une lisière d’opération visible. Chacune combine espace de jeu suivi, portail d’entrée avec casque, écran mural, moniteurs spectateurs en hauteur et poste de contrôle extérieur; le plan en miroir soutient le débit parallèle et la remise à zéro.',
    },
    whatChanged: {
      en: 'The second year made the first year legible as a practice, not a one-off activation.',
      fr: 'La deuxième année a rendu la première lisible comme une pratique, pas comme une activation isolée.',
    },
    credits: [{ name: 'Saël Simard', role: { en: 'Creator / Producer', fr: 'Créateur / producteur' } }],
  },
  {
    slug: 'villa-hublot',
    year: '2022',
    featured: false,
    featuredOrder: 10,
    authorship: 'contribution',
    tier: 'b',
    verification: 'verified',
    heroTreatment: 'typographic',
    climateHint: 'earth',
    tags: ['systems', 'interactive'],
    title: { en: 'Villa Hublot', fr: 'Villa Hublot' },
    role: { en: 'System Designer — Bakuza Events', fr: 'Concepteur de systèmes — Bakuza Events' },
    studio: 'Bakuza Events',
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
    whatChanged: {
      en: 'The project sharpened a practice of carrying exact system responsibility inside a larger studio-authored environment.',
      fr: 'Le projet a précisé une pratique : porter une responsabilité de système exacte au sein d’un environnement d’auteur conçu par un studio plus large.',
    },
    credits: [
      { name: 'Bakuza Events', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'System Designer', fr: 'Concepteur de systèmes' } },
    ],
  },
  {
    slug: 'sensory-odyssey',
    year: '2026',
    featured: false,
    featuredOrder: 11,
    authorship: 'contribution',
    tier: 'b',
    verification: 'verified',
    heroTreatment: 'typographic',
    climateHint: 'sap',
    tags: ['systems', 'immersive'],
    title: { en: 'Sensory Odyssey / Vivid', fr: 'Sensory Odyssey / Vivid' },
    role: { en: 'System Designer — Supply + Demand', fr: 'Concepteur de systèmes — Supply + Demand' },
    studio: 'Supply + Demand',
    lede: {
      en: 'North American deployment of a multisensory touring exhibition. Content by Sensory Odyssey Studio. I did not create Sensory Odyssey.',
      fr: 'Déploiement nord-américain d’une exposition multisensorielle en tournée. Contenu : Sensory Odyssey Studio. Je n’ai pas créé Sensory Odyssey.',
    },
    question: {
      en: 'What does it take to make a complex multisensory tour actually run?',
      fr: 'Que faut-il pour qu’une tournée multisensorielle complexe tienne vraiment ?',
    },
    experience: {
      en: 'At the California Academy of Sciences the adaptation is presented as Vivid: Immerse Your Senses — ecosystems through projection, sound, scent, interactive avatars and scenography. Original content: Sensory Odyssey Studio, in co-production with the Muséum national d’Histoire naturelle, Paris. North American tour co-produced by Supply + Demand.',
      fr: 'À la California Academy of Sciences, l’adaptation s’appelle Vivid : Immerse Your Senses — écosystèmes par projection, son, odeur, avatars interactifs et scénographie. Contenu original : Sensory Odyssey Studio, en coproduction avec le Muséum national d’Histoire naturelle, Paris. Tournée nord-américaine coproduite par Supply + Demand.',
    },
    system: {
      en: 'System design on the Supply + Demand side of a Modular Exhibit System deployment for the North American tour. The role concerns the touring technical system; original content and production remain credited to Sensory Odyssey Studio and its partners.',
      fr: 'Conception de systèmes du côté Supply + Demand pour le déploiement d’un Modular Exhibit System de la tournée nord-américaine. Le rôle concerne le système technique de tournée ; le contenu et la production d’origine restent crédités à Sensory Odyssey Studio et à ses partenaires.',
    },
    whatChanged: {
      en: 'The work extends system design into a touring multisensory format while keeping the boundary between original content and deployment responsibility explicit.',
      fr: 'Le travail étend la conception de systèmes à un format multisensoriel itinérant, tout en gardant explicite la frontière entre contenu d’origine et responsabilité de déploiement.',
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
    featured: false,
    featuredOrder: 12,
    authorship: 'contribution',
    tier: 'b',
    verification: 'verified',
    heroTreatment: 'typographic',
    climateHint: 'earth',
    tags: ['systems', 'interactive'],
    title: { en: 'Le Repaire', fr: 'Le Repaire' },
    role: { en: 'System Designer / Integrator — Supply + Demand', fr: 'Concepteur de systèmes / intégrateur — Supply + Demand' },
    studio: 'Supply + Demand',
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
      en: 'Children roughly 6–12 travel through pulp bales and interactive installations. Railway cars become portals into 1920s Val-Jalbert, guided by Yvon, Gabrielle and Adrienne. Concept, script, scenography, media and art direction are credited to Supply + Demand as a studio.',
      fr: 'Des enfants d’environ 6 à 12 ans traversent ballots de pulpe et installations interactives. Les wagons deviennent des portails vers le Val-Jalbert des années 1920, guidés par Yvon, Gabrielle et Adrienne. Concept, récit, scénographie, médias et direction artistique sont crédités à Supply + Demand comme studio.',
    },
    system: {
      en: 'System design and integration within the Supply + Demand project team, coordinating interactive media with authentic rail cars and site operation. Studio authorship remains explicit; the individual claim is limited to systems and integration.',
      fr: 'Conception de systèmes et intégration au sein de l’équipe Supply + Demand, en coordonnant les médias interactifs avec les wagons authentiques et l’exploitation du site. L’auteur-studio demeure explicite ; la contribution individuelle se limite aux systèmes et à l’intégration.',
    },
    whatChanged: {
      en: 'The contribution is a precise example of integration within clear authorship limits: historic rolling stock, interactive media and daily operation made to coexist.',
      fr: 'La contribution est un exemple précis d’intégration dans des limites d’auteur claires : faire coexister matériel ferroviaire historique, médias interactifs et exploitation quotidienne.',
    },
    credits: [
      { name: 'Supply + Demand', role: { en: 'Studio', fr: 'Studio' } },
      { name: 'Saël Simard', role: { en: 'System Designer / Integrator', fr: 'Concepteur de systèmes / intégrateur' } },
      { name: 'Naomi Silver-Vézina', role: { en: 'Photography (studio post)', fr: 'Photographie (billet studio)' } },
    ],
  },
]

export const labItems = [
  {
    slug: 'i-speak-it',
    year: '2025',
    url: 'https://ispeakit.app',
    title: { en: 'I Speak It', fr: 'I Speak It' },
    lede: {
      en: 'A small AI-assisted language app, shipped because a specific problem was sitting there.',
      fr: 'Une petite appli de langue assistée par IA, expédiée parce qu’un problème précis était là.',
    },
  },
  {
    slug: 'youspoty',
    year: '2025',
    url: 'https://youspoty.vercel.app',
    title: { en: 'YouSpoty', fr: 'YouSpoty' },
    lede: {
      en: 'A utility for swapping Spotify and YouTube Music libraries. Lightweight product thinking. No private access details here.',
      fr: 'Un utilitaire pour échanger bibliothèques Spotify et YouTube Music. Pensée produit légère. Aucun détail d’accès privé ici.',
    },
  },
]

export function localized<T extends Record<string, string>>(value: T, locale: 'en' | 'fr') {
  return value[locale]
}

export { textToLexical }
