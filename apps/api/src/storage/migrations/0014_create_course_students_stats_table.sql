CREATE TABLE IF NOT EXISTS "course_students_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"course_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"new_students_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "course_students_stats_course_id_unique" UNIQUE("course_id"),
	CONSTRAINT "course_students_stats_course_id_month_year_unique" UNIQUE("course_id","month","year")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_students_stats" ADD CONSTRAINT "course_students_stats_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_students_stats" ADD CONSTRAINT "course_students_stats_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
