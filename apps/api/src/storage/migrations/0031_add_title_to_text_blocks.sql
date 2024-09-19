ALTER TABLE "text_blocks" ADD COLUMN "title" varchar(100) DEFAULT 'Title';
UPDATE "text_blocks" SET "title" = 'Title' WHERE "title" IS NULL;
ALTER TABLE "text_blocks" ALTER COLUMN "title" SET NOT NULL;