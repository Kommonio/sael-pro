# sael.pro

Portfolio storefront for **Saël Simard**. Payload CMS + Next.js, English / French, Vercel Blob media.

Temp: `saelpro.vercel.app`  
Production: `sael.pro`

## Local

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin  
  Default seed login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`

## Content

All visitor-facing copy is editable in Payload (`/admin`), localized EN/FR.

- **Projects** — portfolio objects with Experience / System layers
- **Lab items** — small shipped experiments
- **Globals** — Home, Practice, About, Contact, Header, Footer, Site

Do not invent credits. Employment work stays framed as contributions.

## Media (Vercel Blob)

1. In the Vercel project: create a Blob store (`vercel blob` or dashboard).
2. Copy `BLOB_READ_WRITE_TOKEN` into Vercel env and local `.env`.
3. Put originals in `content/media/...` then:

```bash
npm run blob:ingest -- --dir ./content/media --prefix projects
```

The script uploads to Blob and creates/updates Payload Media documents. Attach those Media docs on projects. Pages never hardcode blob URLs.

Admin drag-and-drop also writes to Blob once the token is set.

## Deploy

1. Create a GitHub repo on the **kommon.io** org and push this project.
2. Import the repo in Vercel as project `saelpro` (gives `saelpro.vercel.app`).
3. Create a Neon (or Vercel Postgres) database. Set `DATABASE_URL`.
4. Set `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN`, `PREVIEW_SECRET`, `CRON_SECRET`.
5. Create the Blob store on that Vercel project.
6. Deploy. Run `npm run seed` once against production (or seed locally and migrate) so admin + copy exist.
7. Attach `sael.pro` as the production domain.

## The Condition

The site does not follow the cursor. It attends to stillness, dwell, remembered works, and a quiet occupancy count. Color climate retunes. A session score is openable from the header.
