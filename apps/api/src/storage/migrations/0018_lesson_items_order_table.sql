CREATE TABLE IF NOT EXISTS "lesson_items_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"order" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_items_order" ADD CONSTRAINT "lesson_items_order_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
