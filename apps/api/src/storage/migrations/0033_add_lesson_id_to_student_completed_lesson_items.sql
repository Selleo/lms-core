ALTER TABLE "student_completed_lesson_items" DROP CONSTRAINT "student_completed_lesson_items_student_id_lesson_item_id_unique";--> statement-breakpoint
ALTER TABLE "student_completed_lesson_items" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_student_id_lesson_item_id_lesson_id_unique" UNIQUE("student_id","lesson_item_id","lesson_id");