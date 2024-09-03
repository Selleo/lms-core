ALTER TABLE "files" RENAME COLUMN "status" TO "state";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "status" TO "state";--> statement-breakpoint
ALTER TABLE "text_blocks" RENAME COLUMN "status" TO "state";--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "text_blocks" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;