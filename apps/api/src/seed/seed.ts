import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DatabasePg } from "../common";
import hashPassword from "../common/helpers/hashPassword";
import {
  categories,
  courseLessons,
  courses,
  credentials,
  files,
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentCourses,
  textBlocks,
  users,
} from "../storage/schema";
import { createNiceCourses, seedTruncateAllTables } from "./seed-helpers";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env)) {
  throw new Error("DATABASE_URL not found on .env");
}

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql) as DatabasePg;

async function createOrFindUser(
  email: string,
  password: string,
  userData: any,
) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser) return existingUser;

  const [newUser] = await db.insert(users).values(userData).returning();
  await insertCredential(newUser.id, password);
  return newUser;
}

async function insertCredential(userId: string, password: string) {
  const credentialData = {
    id: faker.string.uuid(),
    userId,
    password: await hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return (await db.insert(credentials).values(credentialData).returning())[0];
}

async function createUsers(count: number) {
  return Promise.all(
    Array.from({ length: count }, async () => {
      const userData = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const [user] = await db.insert(users).values(userData).returning();
      const password = faker.internet.password();
      const credential = await insertCredential(user.id, password);
      return { ...user, credentials: { ...credential, password } };
    }),
  );
}

async function createEntities(
  table: any,
  count: number,
  dataGenerator: () => any,
) {
  const entities = Array.from({ length: count }, dataGenerator);
  return db.insert(table).values(entities).returning();
}

async function createLessonItems(
  lessons: any[],
  files: any[],
  textBlocks: any[],
  questions: any[],
) {
  const createdLessonItems = lessons.flatMap((lesson, index) => [
    {
      id: faker.string.uuid(),
      lessonId: lesson.id,
      lessonItemId: files[index % files.length].id,
      lessonItemType: "file",
      displayOrder: 1,
    },
    {
      id: faker.string.uuid(),
      lessonId: lesson.id,
      lessonItemId: textBlocks[index % textBlocks.length].id,
      lessonItemType: "text_block",
      displayOrder: 2,
    },
    {
      id: faker.string.uuid(),
      lessonId: lesson.id,
      lessonItemId: questions[index % questions.length].id,
      lessonItemType: "question",
      displayOrder: 3,
    },
  ]);
  return db.insert(lessonItems).values(createdLessonItems).returning();
}

async function createCourseLessons(courses: any[], lessons: any[]) {
  const courseLessonsList = courses.flatMap((course) =>
    lessons.slice(0, 3).map((lesson) => ({
      id: faker.string.uuid(),
      courseId: course.id,
      lessonId: lesson.id,
    })),
  );
  return db.insert(courseLessons).values(courseLessonsList).returning();
}

async function createStudentCourses(courses: any[], studentId: string) {
  const studentCoursesList = courses.map((course) => ({
    id: faker.string.uuid(),
    studentId: studentId,
    courseId: course.id,
    numberOfAssignments: faker.number.int({ min: 0, max: 10 }),
    numberOfFinishedAssignments: faker.number.int({ min: 0, max: 10 }),
    state: "not_started",
    archived: false,
  }));

  return db.insert(studentCourses).values(studentCoursesList).returning();
}

async function seed() {
  await seedTruncateAllTables(db);

  try {
    const adminUser = await createOrFindUser("admin@example.com", "password", {
      id: faker.string.uuid(),
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "admin",
    });

    const studentUser = await createOrFindUser(
      "user@example.com",
      "studentpassword",
      {
        id: faker.string.uuid(),
        email: "user@example.com",
        firstName: "Student",
        lastName: "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "student",
      },
    );

    console.log("Created or found admin user:", adminUser);
    console.log("Created or found student user:", studentUser);

    await createUsers(5);
    console.log("Created users with credentials");

    await createNiceCourses(adminUser.id, db);
    console.log("✨✨✨Created created nice courses✨✨✨");

    const createdCategories = await createEntities(categories, 6, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(3),
      archived: faker.datatype.boolean(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created categories");

    const createdTextBlocks = await createEntities(textBlocks, 6, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.words(4),
      body: faker.lorem.paragraph(3),
      archived: faker.datatype.boolean(),
      state: faker.helpers.arrayElement(["draft", "published"]),
      authorId: adminUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created text blocks");

    const createdQuestions = await createEntities(questions, 5, () => ({
      id: faker.string.uuid(),
      questionType: faker.helpers.arrayElement([
        "single_choice",
        "multiple_choice",
      ]),
      questionBody: faker.lorem.paragraph(3),
      solutionExplanation: faker.lorem.paragraph(3),
      state: faker.helpers.arrayElement(["draft", "published"]),
      authorId: adminUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created questions");

    for (const question of createdQuestions) {
      await createEntities(questionAnswerOptions, 4, () => ({
        id: faker.string.uuid(),
        questionId: question.id,
        optionText: faker.lorem.sentence(3),
        isCorrect: faker.datatype.boolean(),
        position: faker.number.int({ min: 1, max: 4 }),
      }));
    }
    console.log("Created question answer options");

    const createdFiles = await createEntities(files, 6, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(3),
      type: faker.helpers.arrayElement([
        "presentation",
        "external_presentation",
        "video",
      ]),
      url: faker.internet.url(),
      state: faker.helpers.arrayElement(["draft", "published"]),
      authorId: adminUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created files");

    const createdLessons = await createEntities(lessons, 16, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(3),
      imageUrl: faker.image.urlPicsumPhotos(),
      authorId: adminUser.id,
      state: faker.helpers.arrayElement(["draft", "published"]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created lessons");

    await createLessonItems(
      createdLessons,
      createdFiles,
      createdTextBlocks,
      createdQuestions,
    );
    console.log("Created lesson items");

    const createdCourses = await createEntities(courses, 5, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(3),
      imageUrl: faker.image.urlPicsumPhotos(),
      state: faker.helpers.arrayElement(["draft", "published"]),
      priceInCents: faker.number.int({ min: 0, max: 1000 }),
      authorId: adminUser.id,
      categoryId: faker.helpers.arrayElement(createdCategories).id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log("Created courses");

    await createCourseLessons(createdCourses, createdLessons);
    console.log("Created course lessons");

    await createStudentCourses(createdCourses, studentUser.id);
    console.log("Created student courses");

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    console.log("Closing database connection");
    try {
      await sql.end();
      console.log("Database connection closed successfully.");
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
}

export default seed;
