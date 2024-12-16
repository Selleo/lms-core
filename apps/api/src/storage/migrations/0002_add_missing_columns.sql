ALTER TABLE "questions" ADD COLUMN "thumbnail_s3_key" varchar(200);--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "image_s3_key" text;