CREATE TABLE IF NOT EXISTS "student_completed_lesson_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"student_id" uuid NOT NULL,
	"lesson_item_id" uuid NOT NULL,
	CONSTRAINT "student_completed_lesson_items_student_id_lesson_item_id_unique" UNIQUE("student_id","lesson_item_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_lesson_item_id_lesson_items_id_fk" FOREIGN KEY ("lesson_item_id") REFERENCES "public"."lesson_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
