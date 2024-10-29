ALTER TABLE "student_lessons_progress" ADD COLUMN "lesson_item_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ADD COLUMN "completed_lesson_item_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ADD COLUMN "quiz_score" integer DEFAULT 0 NOT NULL;
