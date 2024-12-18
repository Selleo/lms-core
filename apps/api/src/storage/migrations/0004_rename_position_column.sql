ALTER TABLE "question_answer_options" RENAME COLUMN "position" TO "display_order";
ALTER TABLE "questions" ADD COLUMN "display_order" integer;