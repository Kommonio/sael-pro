# Video media backend

Project case studies support three video sources through the `Video media` array in Payload:

- `Upload — Vercel Blob`: MP4, WebM, MOV, and M4V files selected from the Media library or uploaded from the project editor.
- `Vimeo embed`: a public Vimeo URL, player URL, unlisted URL, or numeric video ID.
- `YouTube embed`: a watch, short, live, share, or embed URL, or an 11-character video ID.

## Storage

The `media` collection is connected to `@payloadcms/storage-vercel-blob`. `clientUploads: true` sends large files directly from the authenticated Payload admin to Vercel Blob rather than proxying the video body through the Next.js function.

Production requires `BLOB_READ_WRITE_TOKEN`. When the token is absent locally, Payload keeps using the collection’s local `public/media` directory.

Accepted video MIME types are:

- `video/mp4`
- `video/webm`
- `video/quicktime`
- `video/x-m4v`
- `text/vtt` for captions and subtitles

An uploaded video can use either the poster stored on its Media record or a per-project poster override. It can also include any number of English/French WebVTT caption or subtitle tracks, including a default track.

## Editorial fields

Every new video entry requires:

- a source;
- a localized accessible title;
- an uploaded video when the source is `upload`, or a valid provider URL/ID for Vimeo and YouTube;
- a frame ratio.

Optional fields include a localized caption, start time for embeds, an upload poster, and WebVTT tracks for direct uploads. The older singular `video` upload remains readable as a migration fallback; new work should use `videos`.

## Embed safety and privacy

The public renderer never accepts a raw iframe URL. It extracts a provider video ID using an allowlist and constructs the player URL itself:

- YouTube uses `youtube-nocookie.com` and disables related-video expansion.
- Vimeo uses `player.vimeo.com` with `dnt=1` and preserves unlisted-video hashes.
- Both players lazy-load, have required iframe titles, and use a strict referrer policy.

Invalid hosts, non-HTTPS provider URLs, JavaScript URLs, and provider mismatches fail CMS validation and are ignored by the renderer as a second line of defense.

## Database deployment

The additive Postgres migration is registered through `prodMigrations`. Apply it to the target environment before deploying code that writes the new fields:

```sh
npm run migrate
```

The migration creates the live and draft/version video tables, their indexes and foreign keys, the provider/ratio/track enums, and adds the `captions` value to the existing Media kind enum. It does not modify or backfill existing project records.
