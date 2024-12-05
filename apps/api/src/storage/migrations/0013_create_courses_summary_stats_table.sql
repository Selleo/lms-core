CREATE TABLE IF NOT EXISTS "courses_summary_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"course_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"free_purchased_count" integer DEFAULT 0 NOT NULL,
	"paid_purchased_count" integer DEFAULT 0 NOT NULL,
	"paid_purchased_after_freemium_count" integer DEFAULT 0 NOT NULL,
	"completed_freemium_student_count" integer DEFAULT 0 NOT NULL,
	"completed_course_student_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "courses_summary_stats_course_id_unique" UNIQUE("course_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses_summary_stats" ADD CONSTRAINT "courses_summary_stats_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses_summary_stats" ADD CONSTRAINT "courses_summary_stats_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
