ALTER TABLE "lesson_items" DROP CONSTRAINT "lesson_items_lesson_id_display_order_unique";--> statement-breakpoint
ALTER TABLE "course_lessons" ADD COLUMN "display_order" integer;