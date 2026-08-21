import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_hero_treatment" AS ENUM('media', 'typographic');
  CREATE TYPE "public"."enum__projects_v_version_hero_treatment" AS ENUM('media', 'typographic');
  CREATE TYPE "public"."enum_media_purpose" AS ENUM('informative', 'decorative');
  ALTER TABLE "projects" ADD COLUMN "hero_treatment" "enum_projects_hero_treatment";
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_treatment" "enum__projects_v_version_hero_treatment";
  ALTER TABLE "media" ADD COLUMN "purpose" "enum_media_purpose";
  ALTER TABLE "media" ADD COLUMN "rights_confirmed" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "hero_treatment";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_treatment";
  ALTER TABLE "media" DROP COLUMN "purpose";
  ALTER TABLE "media" DROP COLUMN "rights_confirmed";
  DROP TYPE "public"."enum_projects_hero_treatment";
  DROP TYPE "public"."enum__projects_v_version_hero_treatment";
  DROP TYPE "public"."enum_media_purpose";`)
}
