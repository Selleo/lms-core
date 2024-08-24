ALTER TABLE "categories" ADD CONSTRAINT "categories_title_unique" UNIQUE("title");
ALTER TABLE "categories" RENAME COLUMN "archived_at" TO "archived_temp";
ALTER TABLE "categories" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;
UPDATE "categories" SET "archived" = ("archived_temp" IS NOT NULL);
ALTER TABLE "categories" DROP COLUMN "archived_temp";