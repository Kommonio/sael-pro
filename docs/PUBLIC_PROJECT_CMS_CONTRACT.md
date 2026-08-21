# Public project CMS contract

Status: implemented as a strict typed adapter and server-side readiness reader. The nullable CMS fields and additive migration now exist; production migration, editorial backfill, and route cutover remain staged work.

## Boundary

`src/lib/publicProjects.ts` is the canonical public project view model. It owns:

- localized project copy;
- authorship, tier, normalized tags, featured state, and featured order;
- role, context, technologies, and localized credits;
- hero, gallery, video, and diagram media with focal points;
- the explicit `media` or `typographic` hero treatment;
- media purpose, localized alt behavior, rights confirmation, and credit;
- deterministic public-readiness issues.

The canonical tag order is `authored`, `systems`, `interactive`, `immersive`, `software`, `experiments`. Unknown tags are rejected by normalization rather than becoming ad hoc UI filters.

`getPublicProjects` and `getPublicProject` in `src/lib/payload.ts` query EN and FR independently with locale fallback disabled. They derive readiness on the server and return only ready `PublicProjectView` records. Clients must not rebuild or weaken the readiness rules.

The older `getProjects`, `getProject`, and catalog fallback remain temporarily in route consumers. That is intentional: most existing project records are not yet editorially ready, even though the schema can now store explicit hero treatment, media purpose, and rights confirmation. Switching routes before production backfill would correctly return too few projects and damage the portfolio.

## Public-readiness rules

A project is public only when all of these are true:

1. EN and FR records exist without Payload locale fallback.
2. Both localized versions are published and factually verified.
3. EN and FR title, year, exact role, lede, and complete localized credits exist.
4. The project explicitly chooses `media` or `typographic`; the absence of media is never interpreted as an intentional typographic treatment.
5. A `media` treatment has a populated hero relationship at depth 2.
6. Every referenced asset declares `informative` or `decorative`, has confirmed display rights, and has a creator/studio/rights-holder credit.
7. Informative assets have localized EN/FR alt text. Decorative assets have empty alt text.
8. Featured projects have a featured order.
9. Work experiments use authorship `experiment`, tier `c`, and tag `experiments`, with complete question/experience/system case-study copy in both languages. Lightweight utilities belong in Lab Items.
10. Public copy contains no archive-recovery, pending-confirmation, or other internal editorial notes.

Readiness failures include field paths, locale, and an editor-facing corrective message. `getProjectReadinessReport` exposes these diagnostics for server-side editorial tooling.

## Staged migration and cutover

Do this as a staged migration; do not add required columns to populated production tables in one deployment.

1. Back up the production database and export the media inventory. Production backup remains mandatory immediately before applying the migration.
2. Add the following optional fields first (implemented in `20260821_174112_public_media_contract`):
   - `projects.heroTreatment`: non-localized select with values `media` and `typographic`; no default.
   - `media.purpose`: non-localized select with values `informative` and `decorative`; no default.
   - `media.rightsConfirmed`: non-localized checkbox, initially false.
3. Run `npm run generate:types` and generate the corresponding Payload database migration. This has been completed locally; production still needs the registered additive migrations applied before importing archive media.
4. Backfill editorial intent:
   - choose `media` only when the approved hero is populated;
   - choose `typographic` by an explicit editorial decision, never by inferring from a missing hero;
   - classify every project-linked asset as informative or decorative;
   - write EN and FR alt text for informative media and clear alt for decorative media;
   - confirm rights and credit for every displayed asset;
   - move small utilities to Lab Items; reserve Project tier C for case-study-grade experiments;
   - remove internal research notes from public copy and move them to an editorial ledger;
   - change `verification` to `verified` only after factual review.
5. Run `npx tsx tools/report-public-project-readiness.ts` against staging until every intended public record is ready. Run `npx tsx tools/check-public-project-contract.ts` for deterministic contract regression coverage.
6. Reconcile before/after project counts, ready counts, locale completeness, media relationship counts, and media checksums. Test rollback from the backup.
7. Make `heroTreatment` required in the Projects config. Make `purpose` and `rightsConfirmed` required for project-linked public media through collection validation. Generate and deploy the constraint migration only after the readiness report is clean.
8. Change Home, Work, case metadata/static params, and sitemap consumers to `getPublicProjects` / `getPublicProject`. Remove `toProjectCard`, `mergeCaseStudy`, and catalog project fallbacks only after the migrated CMS record count matches the intended public catalog.

The field labels for Project tier C, experiment authorship/tagging, and verification have already been clarified without changing stored enum values or the database schema.

## Checks

```powershell
npx tsx tools/check-public-project-contract.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/publicProjects.ts src/lib/payload.ts src/collections/Projects.ts tools/check-public-project-contract.ts tools/report-public-project-readiness.ts
```
