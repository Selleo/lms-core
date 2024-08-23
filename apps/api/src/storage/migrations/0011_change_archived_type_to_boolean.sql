ALTER TABLE "categories" RENAME COLUMN "archived_at" TO "archived";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "archived" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "archived" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "archived" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;