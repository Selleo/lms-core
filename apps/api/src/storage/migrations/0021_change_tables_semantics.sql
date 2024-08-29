ALTER TABLE "lesson_items_order" RENAME TO "lesson_items";--> statement-breakpoint
ALTER TABLE "lesson_items" RENAME COLUMN "item_id" TO "lesson_item_id";--> statement-breakpoint
ALTER TABLE "lesson_items" RENAME COLUMN "item_type" TO "lesson_item_type";--> statement-breakpoint
ALTER TABLE "lesson_items" RENAME COLUMN "order" TO "display_order";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "question_text" TO "question_body";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "answer_explanation" TO "solution_explanation";--> statement-breakpoint
ALTER TABLE "lesson_items" DROP CONSTRAINT "lesson_items_order_lesson_id_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "status" SET DEFAULT 'Draft';--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "description" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "status" SET DEFAULT 'Draft';--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "status" SET DEFAULT 'Draft';--> statement-breakpoint
ALTER TABLE "text_blocks" ALTER COLUMN "status" SET DEFAULT 'Draft';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_items" ADD CONSTRAINT "lesson_items_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lesson_items" ADD CONSTRAINT "lesson_items_lesson_id_display_order_unique" UNIQUE("lesson_id","display_order");