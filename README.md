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

## Deploy status

Already done:

- GitHub: [Kommonio/sael-pro](https://github.com/Kommonio/sael-pro)
- Vercel project: `kommonio/saelpro` (temp host `saelpro.vercel.app`)
- Git connected (deploys on push to `master`)
- Blob store: `saelpro-media` (public), `BLOB_READ_WRITE_TOKEN` on all environments
- `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SERVER_URL` set on Production/Preview

Still required before the first production deploy:

1. In the Vercel project → **Storage**, create a **Neon** Postgres database and attach it so `DATABASE_URL` is set. The Kommonio Neon org is Vercel-managed, so the database must be created from Vercel, not the Neon CLI.
2. Redeploy. Then seed production once:

```bash
# with production DATABASE_URL + PAYLOAD_SECRET in the shell
npm run seed
```

3. Attach **sael.pro** as the production domain in Vercel (DNS). After that, set `NEXT_PUBLIC_SERVER_URL` to `https://sael.pro`.

Local Blob ingest after `vercel env pull`:

```bash
npm run blob:ingest -- --dir ./content/media --prefix projects
```

## The Condition

The site does not follow the cursor. It attends to stillness, dwell, remembered works, and a quiet occupancy count. Color climate retunes. A session score is openable from the header.
