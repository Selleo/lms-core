ALTER TABLE "student_lesson_progress" DROP CONSTRAINT "student_lesson_progress_student_id_lesson_id_unique";--> statement-breakpoint
ALTER TABLE "student_lesson_progress" ADD COLUMN "chapter_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_lesson_progress" ADD CONSTRAINT "student_lesson_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "student_lesson_progress" ADD CONSTRAINT "student_lesson_progress_student_id_lesson_id_chapter_id_unique" UNIQUE("student_id","lesson_id","chapter_id");