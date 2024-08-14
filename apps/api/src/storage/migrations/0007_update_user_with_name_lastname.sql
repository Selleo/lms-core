ALTER TABLE "users" ADD COLUMN "first_name" text;
ALTER TABLE "users" ADD COLUMN "last_name" text;

UPDATE "users" SET "first_name" = 'DefaultFirstName' WHERE "first_name" IS NULL;
UPDATE "users" SET "last_name" = 'DefaultLastName' WHERE "last_name" IS NULL;

ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;
