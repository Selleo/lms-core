CREATE TABLE IF NOT EXISTS "scorm_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"course_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"version" text NOT NULL,
	"entry_point" text NOT NULL,
	"s3_key" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scorm_metadata" ADD CONSTRAINT "scorm_metadata_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scorm_metadata" ADD CONSTRAINT "scorm_metadata_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
