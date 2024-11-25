ALTER TABLE "student_lessons_progress" ALTER COLUMN "quiz_score" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ALTER COLUMN "quiz_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "items_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" ADD COLUMN "completed_at" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "student_lessons_progress" DROP COLUMN IF EXISTS "lesson_item_count";

UPDATE lessons
SET items_count = (
  SELECT COUNT(lesson_items.id)
  FROM lesson_items
  WHERE lesson_items.lesson_id = lessons.id
    AND lesson_items.lesson_item_type != 'text_block'
);


