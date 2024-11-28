ALTER TABLE "student_lessons_progress" ADD COLUMN "completed_as_freemium" boolean DEFAULT false NOT NULL;

CREATE MATERIALIZED VIEW
  "course_statistics_per_teacher" AS
SELECT
  c.author_id AS teacher_id,
  c.id AS course_id,
  COUNT(sc.id) AS student_count,
  SUM(
    CASE
      WHEN sc.state = 'completed' THEN 1
      ELSE 0
    END
  ) AS completed_student_count,
  COUNT(
    DISTINCT CASE
      WHEN slp.completed_as_freemium = true THEN sc.student_id
      ELSE NULL
    END
  ) AS purchased_after_freemium_count
FROM
  courses c
  LEFT JOIN student_courses sc ON c.id = sc.course_id
  LEFT JOIN student_lessons_progress slp ON c.id = slp.course_id
  AND slp.completed_at IS NOT NULL
GROUP BY
  c.author_id,
  c.id;