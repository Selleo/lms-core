ALTER TABLE "student_question_answers" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_question_answers" ADD CONSTRAINT "student_question_answers_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "student_question_answers" ADD CONSTRAINT "student_question_answers_lesson_id_question_id_student_id_unique" UNIQUE("lesson_id","question_id","student_id");