import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_landing_position" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__projects_v_version_landing_position" AS ENUM('primary', 'secondary');
  ALTER TABLE "projects" ADD COLUMN "landing_position" "enum_projects_landing_position";
  ALTER TABLE "_projects_v" ADD COLUMN "version_landing_position" "enum__projects_v_version_landing_position";
  UPDATE "projects" SET "landing_position" = 'primary' WHERE "slug" = 'azul-vivo';
  UPDATE "projects" SET "landing_position" = 'secondary' WHERE "slug" = 'onmove';
  UPDATE "_projects_v"
    SET "version_landing_position" = 'primary'
    WHERE "parent_id" IN (SELECT "id" FROM "projects" WHERE "slug" = 'azul-vivo');
  UPDATE "_projects_v"
    SET "version_landing_position" = 'secondary'
    WHERE "parent_id" IN (SELECT "id" FROM "projects" WHERE "slug" = 'onmove');
  CREATE UNIQUE INDEX "projects_landing_position_idx" ON "projects" USING btree ("landing_position");
  CREATE INDEX "_projects_v_version_version_landing_position_idx" ON "_projects_v" USING btree ("version_landing_position");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "projects_landing_position_idx";
  DROP INDEX "_projects_v_version_version_landing_position_idx";
  ALTER TABLE "projects" DROP COLUMN "landing_position";
  ALTER TABLE "_projects_v" DROP COLUMN "version_landing_position";
  DROP TYPE "public"."enum_projects_landing_position";
  DROP TYPE "public"."enum__projects_v_version_landing_position";`)
}
