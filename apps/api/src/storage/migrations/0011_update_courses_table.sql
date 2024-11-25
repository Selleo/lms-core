ALTER TABLE "student_courses" RENAME COLUMN "number_of_finished_assignments" TO "finished_lessons_count";--> statement-breakpoint
ALTER TABLE "student_courses" ALTER COLUMN "finished_lessons_count" SET DEFAULT 0;--> statement-breakpoint

UPDATE student_courses
SET
  finished_lessons_count = (
    SELECT
      COUNT(course_id)
    FROM
      course_lessons
      LEFT JOIN lessons ON course_lessons.lesson_id = lessons.id
    WHERE
      course_lessons.course_id = student_courses.course_id
    GROUP BY
      course_lessons.course_id
);

ALTER TABLE "student_courses" ALTER COLUMN "finished_lessons_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "lessons_count" integer DEFAULT 0;--> statement-breakpoint

UPDATE courses
SET
  lessons_count = (
    SELECT
      COUNT(course_id)
    FROM
      course_lessons
        LEFT JOIN lessons ON course_lessons.lesson_id = lessons.id
    WHERE
      course_lessons.course_id = courses.id
    GROUP BY
      course_lessons.course_id
);

ALTER TABLE "courses" ALTER COLUMN "lessons_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student_courses" ADD COLUMN "completed_at" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "student_courses" DROP COLUMN IF EXISTS "number_of_assignments";

