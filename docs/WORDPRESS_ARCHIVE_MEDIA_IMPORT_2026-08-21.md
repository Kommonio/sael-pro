# WordPress archive and curated media import

Date: 2026-08-21

## Result

The supplied `2019.zip`, `2021.zip`, and `2022.zip` archives were inspected as one historical WordPress uploads set. The archive contains 6,203 files and expands to approximately 1.36 GB. Duplicate yearly material was not copied into the repository more than once.

The public catalog now has an explicit media decision for every project:

- five cases use verified media heroes: Azul Vivo, OnMove, The Man Who Planted Trees, Viventi Mori, and Versus;
- five cases use intentional typographic/system heroes: Echoes, Omega Protocol, Villa Hublot, Sensory Odyssey / Vivid, and Le Repaire;
- no case silently reserves a blank full-viewport hero;
- every EN/FR case has title, role, lede, question, experience, system, what-changed, and complete credit roles.

The local Payload database reports **10/10 public projects ready**. Production has not been mutated.

## Evidence selected

### Unambiguous archive material

| Use | Source | SHA-256 | Public credit |
| --- | --- | --- | --- |
| Viventi Mori hero | `2021/01/Viventi_mori_Cover.png` | `d1e13e010aa2d9abe1e125fc450f97f5155628c304cf677215352033cbb5e2db` | Kommon Collective |
| Viventi Mori installation | `2021/10/VM_ProjectThumbnail.png` | `a0892ac7b72cad5cba9c38cc2be5e5c62d973e6e00e967751ba44826afab2be3` | Kommon Collective |
| Viventi Mori documentation film | `2021/10/Viventi-Mori-–-Kommon-Collective.mp4` | `d86d0637ab48303accba1ea609a11b4098503d42368658e7467db3829d12876f` | Kommon Collective |
| Versus two-room plan | `2022/12/Versus-Plan-v11_2.png` | `aa1a1deae0b2e11b843646c5ac88fec4f918e83fa7ff366ace4037863a153be1` | Saël Simard |
| Practice process drawing | `2021/10/Workflow-plan.png` | `3f563f1779c232e908ef3a85c70dbd8f8e5e8f7d44237cca9d892ccdf94fa65f` | Saël Simard — archive process drawing |
| Lab fabrication detail | `2021/10/IMG_3431.jpg` | `2833d6eb9fc70049772e510db18c1718d8578d970925c1313a297c328642fd52` | Kommon Collective — Viventi Mori fabrication archive |

The process drawing and fabrication detail replace generic synthetic section illustrations. About uses the real portrait; Contact is intentionally typographic and no longer depicts a fabricated “USB pigeon.”

### Current first-party or already-used portfolio evidence

| Project | Use | Source |
| --- | --- | --- |
| Azul Vivo | Hero plus three documentary reef stills | Existing official Azul Vivo / Presence material in `public/stills` |
| The Man Who Planted Trees | Exhibition hero | Existing Supply + Demand project still, with studio credit |
| OnMove | Product hero | Live public OnMove interface captured on 2026-08-21, containing no account or customer data |

The former Azul “institutional VR” image was removed from the gallery because it reads as synthetic rather than documentary evidence. The former OnMove cover was removed because it was a generic Google Street View frame, not project proof.

### Generated material

One generated image is published: `assets/generated/versus-immersive-hero-v1.png`.

It was constrained by the exact recovered Versus axonometric plan and the known two-room public installation layout. It is credited visibly as **“Saël Simard — AI-assisted visualization”** and is not represented as documentary photography. The original plan remains visible as the System diagram.

No additional project image was generated when the archive could not establish the room, hardware, people, or visual identity. Those cases use metadata-driven system fields instead of plausible-looking invented scenes.

## Backend path

`tools/import-wordpress-archive.ts` imports through Payload’s Local API. Payload’s Vercel Blob adapter owns the file upload, responsive variants, Media record, localized alt text, credit, purpose, rights flag, and project relationship. The importer does not use direct Blob writes.

The current local media library contains 13 curated records. Project relationships include:

- Azul Vivo: hero plus three Experience/gallery stills;
- OnMove: current product-interface hero;
- The Man Who Planted Trees: credited exhibition hero;
- Viventi Mori: hero, Experience image, and uploaded documentation film with poster;
- Versus: plan-grounded hero and original system diagram.

The Practice and Lab archive images are also stored in the backend and rendered through `/api/media/file/…?prefix=cms-media`.

## Narrative corrections

- `Le Repaire (secret secret)` is now `Le Repaire` in EN and FR.
- Omega Protocol no longer publishes an archive-recovery task as case-study copy.
- Sensory Odyssey no longer publishes “details remain for confirmation.”
- Villa Hublot, Sensory Odyssey, and Le Repaire now have concise, attribution-safe what-changed sections in both languages.
- English credit roles were reconciled for every project instead of disappearing after the French localized-array update.
- About falls back as a complete localized structure when a CMS locale contains only partial phases or education rows.

## Verification

Latest local checks:

- `report-public-project-readiness.ts`: **10/10 ready**;
- `npm run content:validate`: **32 EN/FR routes, 10 projects, 0 failures**;
- `npm run media:validate`: **32 routes, 86 CMS asset URLs/variants, 0 failures**;
- `npm run test:e2e`: **69 passed, 168 opt-in visual baselines skipped**;
- `npx tsc --noEmit`, `npm run lint`, and `git diff --check`: passed.

Visual audit contact sheets are written under `tmp/wp-uploads-analysis/visual-audit`. They cover every main route and every project in both languages at desktop and mobile sizes, plus every case-study Experience chapter.

## Commands

Dry run:

```powershell
npm run media:import:wordpress
```

Apply to the linked local environment:

```powershell
npm run media:import:wordpress -- --target local --apply
npx tsx tools/reconcile-project-content.ts --apply
```

Validate:

```powershell
npm run content:validate
npm run media:validate
npm run test:e2e
```

Production remains an explicit, separate operation because its migration ledger must be reconciled before applying the additive media schema.
