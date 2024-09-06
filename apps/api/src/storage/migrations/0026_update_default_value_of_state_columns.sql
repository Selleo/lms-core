ALTER TABLE "files" ALTER COLUMN "state" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "state" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "state" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "text_blocks" ALTER COLUMN "state" SET DEFAULT 'draft';