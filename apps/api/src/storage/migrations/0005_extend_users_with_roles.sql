CREATE TYPE role AS ENUM ('admin', 'student', 'teacher');
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'student' NOT NULL;
