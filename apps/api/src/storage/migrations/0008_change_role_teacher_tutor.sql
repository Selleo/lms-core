DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM ('admin', 'student', 'tutor');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tutor' AND enumtypid = 'role'::regtype) THEN
            ALTER TYPE role ADD VALUE 'tutor';
        END IF;

        IF EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = 'role'::regtype)
           AND NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tutor' AND enumtypid = 'role'::regtype) THEN
            ALTER TYPE role RENAME VALUE 'teacher' TO 'tutor';
        END IF;
    END IF;
END $$;

COMMIT;

DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
    ) INTO column_exists;

    IF NOT column_exists THEN
        ALTER TABLE "users" ADD COLUMN "role" role DEFAULT 'student'::role NOT NULL;
    ELSE
        UPDATE "users" SET "role" = 'tutor'::role WHERE "role"::text = 'teacher';

        ALTER TABLE "users" ALTER COLUMN "role" TYPE role USING "role"::text::role;

        ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'::role;
    END IF;
END $$;
