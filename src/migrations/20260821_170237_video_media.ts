import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_projects_videos_tracks_kind" AS ENUM('captions', 'subtitles');
    CREATE TYPE "public"."enum_projects_videos_tracks_language" AS ENUM('en', 'fr');
    CREATE TYPE "public"."enum_projects_videos_source" AS ENUM('upload', 'vimeo', 'youtube');
    CREATE TYPE "public"."enum_projects_videos_aspect_ratio" AS ENUM('16:9', '4:3', '1:1', '9:16');
    CREATE TYPE "public"."enum__projects_v_version_videos_tracks_kind" AS ENUM('captions', 'subtitles');
    CREATE TYPE "public"."enum__projects_v_version_videos_tracks_language" AS ENUM('en', 'fr');
    CREATE TYPE "public"."enum__projects_v_version_videos_source" AS ENUM('upload', 'vimeo', 'youtube');
    CREATE TYPE "public"."enum__projects_v_version_videos_aspect_ratio" AS ENUM('16:9', '4:3', '1:1', '9:16');
    ALTER TYPE "public"."enum_media_kind" ADD VALUE IF NOT EXISTS 'captions';

    CREATE TABLE "projects_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "source" "enum_projects_videos_source" DEFAULT 'upload',
      "asset_id" integer,
      "url" varchar,
      "poster_id" integer,
      "start_at" numeric DEFAULT 0,
      "aspect_ratio" "enum_projects_videos_aspect_ratio" DEFAULT '16:9'
    );

    CREATE TABLE "projects_videos_tracks" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "file_id" integer,
      "kind" "enum_projects_videos_tracks_kind" DEFAULT 'captions',
      "language" "enum_projects_videos_tracks_language",
      "label" varchar,
      "default" boolean DEFAULT false
    );

    CREATE TABLE "projects_videos_locales" (
      "title" varchar,
      "caption" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE "_projects_v_version_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "source" "enum__projects_v_version_videos_source" DEFAULT 'upload',
      "asset_id" integer,
      "url" varchar,
      "poster_id" integer,
      "start_at" numeric DEFAULT 0,
      "aspect_ratio" "enum__projects_v_version_videos_aspect_ratio" DEFAULT '16:9',
      "_uuid" varchar
    );

    CREATE TABLE "_projects_v_version_videos_tracks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "file_id" integer,
      "kind" "enum__projects_v_version_videos_tracks_kind" DEFAULT 'captions',
      "language" "enum__projects_v_version_videos_tracks_language",
      "label" varchar,
      "default" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE "_projects_v_version_videos_locales" (
      "title" varchar,
      "caption" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    ALTER TABLE "projects_videos" ADD CONSTRAINT "projects_videos_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "projects_videos" ADD CONSTRAINT "projects_videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "projects_videos" ADD CONSTRAINT "projects_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "projects_videos_tracks" ADD CONSTRAINT "projects_videos_tracks_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "projects_videos_tracks" ADD CONSTRAINT "projects_videos_tracks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_videos"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "projects_videos_locales" ADD CONSTRAINT "projects_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_videos"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_projects_v_version_videos" ADD CONSTRAINT "_projects_v_version_videos_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_projects_v_version_videos" ADD CONSTRAINT "_projects_v_version_videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_projects_v_version_videos" ADD CONSTRAINT "_projects_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_projects_v_version_videos_tracks" ADD CONSTRAINT "_projects_v_version_videos_tracks_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_projects_v_version_videos_tracks" ADD CONSTRAINT "_projects_v_version_videos_tracks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_projects_v_version_videos_locales" ADD CONSTRAINT "_projects_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "projects_videos_order_idx" ON "projects_videos" USING btree ("_order");
    CREATE INDEX "projects_videos_parent_id_idx" ON "projects_videos" USING btree ("_parent_id");
    CREATE INDEX "projects_videos_asset_idx" ON "projects_videos" USING btree ("asset_id");
    CREATE INDEX "projects_videos_poster_idx" ON "projects_videos" USING btree ("poster_id");
    CREATE INDEX "projects_videos_tracks_order_idx" ON "projects_videos_tracks" USING btree ("_order");
    CREATE INDEX "projects_videos_tracks_parent_id_idx" ON "projects_videos_tracks" USING btree ("_parent_id");
    CREATE INDEX "projects_videos_tracks_file_idx" ON "projects_videos_tracks" USING btree ("file_id");
    CREATE UNIQUE INDEX "projects_videos_locales_locale_parent_id_unique" ON "projects_videos_locales" USING btree ("_locale", "_parent_id");

    CREATE INDEX "_projects_v_version_videos_order_idx" ON "_projects_v_version_videos" USING btree ("_order");
    CREATE INDEX "_projects_v_version_videos_parent_id_idx" ON "_projects_v_version_videos" USING btree ("_parent_id");
    CREATE INDEX "_projects_v_version_videos_asset_idx" ON "_projects_v_version_videos" USING btree ("asset_id");
    CREATE INDEX "_projects_v_version_videos_poster_idx" ON "_projects_v_version_videos" USING btree ("poster_id");
    CREATE INDEX "_projects_v_version_videos_tracks_order_idx" ON "_projects_v_version_videos_tracks" USING btree ("_order");
    CREATE INDEX "_projects_v_version_videos_tracks_parent_id_idx" ON "_projects_v_version_videos_tracks" USING btree ("_parent_id");
    CREATE INDEX "_projects_v_version_videos_tracks_file_idx" ON "_projects_v_version_videos_tracks" USING btree ("file_id");
    CREATE UNIQUE INDEX "_projects_v_version_videos_locales_locale_parent_id_unique" ON "_projects_v_version_videos_locales" USING btree ("_locale", "_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "projects_videos_tracks" CASCADE;
    DROP TABLE "projects_videos_locales" CASCADE;
    DROP TABLE "projects_videos" CASCADE;
    DROP TABLE "_projects_v_version_videos_tracks" CASCADE;
    DROP TABLE "_projects_v_version_videos_locales" CASCADE;
    DROP TABLE "_projects_v_version_videos" CASCADE;

    DROP TYPE "public"."enum_projects_videos_tracks_kind";
    DROP TYPE "public"."enum_projects_videos_tracks_language";
    DROP TYPE "public"."enum_projects_videos_source";
    DROP TYPE "public"."enum_projects_videos_aspect_ratio";
    DROP TYPE "public"."enum__projects_v_version_videos_tracks_kind";
    DROP TYPE "public"."enum__projects_v_version_videos_tracks_language";
    DROP TYPE "public"."enum__projects_v_version_videos_source";
    DROP TYPE "public"."enum__projects_v_version_videos_aspect_ratio";

    UPDATE "media" SET "kind" = 'auto' WHERE "kind" = 'captions';
    ALTER TABLE "media" ALTER COLUMN "kind" DROP DEFAULT;
    ALTER TYPE "public"."enum_media_kind" RENAME TO "enum_media_kind_with_captions";
    CREATE TYPE "public"."enum_media_kind" AS ENUM('auto', 'image', 'video', 'diagram');
    ALTER TABLE "media" ALTER COLUMN "kind" TYPE "public"."enum_media_kind" USING "kind"::text::"public"."enum_media_kind";
    ALTER TABLE "media" ALTER COLUMN "kind" SET DEFAULT 'auto';
    DROP TYPE "public"."enum_media_kind_with_captions";
  `)
}
