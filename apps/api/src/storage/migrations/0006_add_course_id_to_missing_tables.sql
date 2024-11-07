ALTER TABLE "student_completed_lesson_items" DROP CONSTRAINT "student_completed_lesson_items_student_id_lesson_item_id_lesson_id_unique";--> statement-breakpoint
ALTER TABLE "student_lessons_progress" DROP CONSTRAINT "student_lessons_progress_student_id_lesson_id_unique";--> statement-breakpoint
ALTER TABLE "student_completed_lesson_items" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "student_question_answers" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_lessons_progress" ADD CONSTRAINT "student_lessons_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_question_answers" ADD CONSTRAINT "student_question_answers_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "student_completed_lesson_items" ADD CONSTRAINT "student_completed_lesson_items_student_id_lesson_item_id_lesson_id_course_id_unique" UNIQUE("student_id","lesson_item_id","lesson_id","course_id");--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ADD CONSTRAINT "student_lessons_progress_student_id_lesson_id_course_id_unique" UNIQUE("student_id","lesson_id","course_id");