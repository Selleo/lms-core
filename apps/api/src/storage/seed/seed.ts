import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { sampleSize } from "lodash";
import postgres from "postgres";

import hashPassword from "../../common/helpers/hashPassword";
import { STATES } from "../../common/states";
import { LESSON_ITEM_TYPE } from "../../lessons/lesson.type";
import { USER_ROLES } from "../../users/schemas/user-roles";
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
} from "../schema";
import { STATUS } from "../schema/utils";

import { createNiceCourses, seedTruncateAllTables } from "./seed-helpers";

import type { DatabasePg, UUIDType } from "../../common";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env)) {
  throw new Error("DATABASE_URL not found on .env");
}

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql) as DatabasePg;

async function createOrFindUser(email: string, password: string, userData: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
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

async function createEntities(table: any, count: number, dataGenerator: () => any) {
  const entities = Array.from({ length: count }, dataGenerator);
  return db.insert(table).values(entities).returning();
}

async function createCoursesWithLessons(
  adminUserId: string,
  categories: any[],
  existingFiles: any[],
  existingTextBlocks: any[],
  existingQuestions: any[],
) {
  const coursesData = [];
  const lessonsData = [];
  const lessonItemsData = [];
  const courseToLessonsMap = new Map<UUIDType, UUIDType[]>();

  for (let i = 0; i < 10; i++) {
    const courseId = faker.string.uuid();
    const isPublished = i < 6; // First 6 courses will be published, rest will be drafts

    const course = {
      id: courseId,
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(3),
      imageUrl: faker.image.urlPicsumPhotos(),
      state: isPublished ? STATUS.published.key : STATUS.draft.key,
      priceInCents: i % 3 === 0 ? faker.number.int({ min: 0, max: 1000 }) : 0,
      authorId: adminUserId,
      categoryId: faker.helpers.arrayElement(categories).id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coursesData.push(course);

    if (isPublished) {
      const courseLessons = [];
      for (let j = 0; j < 3; j++) {
        const lessonId = faker.string.uuid();
        const lesson = {
          id: lessonId,
          title: faker.lorem.sentence(3),
          description: faker.lorem.paragraph(3),
          imageUrl: faker.image.urlPicsumPhotos(),
          authorId: adminUserId,
          state: STATUS.published.key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        lessonsData.push(lesson);
        courseLessons.push(lessonId);

        // Create published lesson items for published lessons
        lessonItemsData.push(
          ...createLessonItems(lessonId, existingFiles, existingTextBlocks, existingQuestions),
        );
      }
      courseToLessonsMap.set(courseId, courseLessons);
    } else {
      // For draft courses, create a mix of draft and published lessons
      const courseLessons = [];
      for (let j = 0; j < 2; j++) {
        const lessonId = faker.string.uuid();
        const lesson = {
          id: lessonId,
          title: faker.lorem.sentence(3),
          description: faker.lorem.paragraph(3),
          imageUrl: faker.image.urlPicsumPhotos(),
          authorId: adminUserId,
          state: STATUS.published.key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        lessonsData.push(lesson);
        courseLessons.push(lessonId);

        lessonItemsData.push(
          ...createLessonItems(lessonId, existingFiles, existingTextBlocks, existingQuestions),
        );
      }
      courseToLessonsMap.set(courseId, courseLessons);
    }
  }

  const createdCourses = await db.insert(courses).values(coursesData).returning();
  await db.insert(lessons).values(lessonsData).returning();
  await db.insert(lessonItems).values(lessonItemsData);

  // Create course-lesson associations
  const courseLessonsData = [];
  for (const [courseId, lessonIds] of courseToLessonsMap.entries()) {
    courseLessonsData.push(
      ...lessonIds.map((lessonId) => ({
        id: faker.string.uuid(),
        courseId,
        lessonId,
      })),
    );
  }
  await db.insert(courseLessons).values(courseLessonsData);

  return createdCourses;
}

function createLessonItems(lessonId: string, files: any[], textBlocks: any[], questions: any[]) {
  return [
    {
      id: faker.string.uuid(),
      lessonId: lessonId,
      lessonItemId: faker.helpers.arrayElement(files).id,
      lessonItemType: LESSON_ITEM_TYPE.file.key,
      displayOrder: 1,
    },
    {
      id: faker.string.uuid(),
      lessonId: lessonId,
      lessonItemId: faker.helpers.arrayElement(textBlocks).id,
      lessonItemType: LESSON_ITEM_TYPE.text_block.key,
      displayOrder: 2,
    },
    {
      id: faker.string.uuid(),
      lessonId: lessonId,
      lessonItemId: faker.helpers.arrayElement(questions).id,
      lessonItemType: LESSON_ITEM_TYPE.question.key,
      displayOrder: 3,
    },
  ];
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
      role: USER_ROLES.admin,
    });

    const studentUser = await createOrFindUser("user@example.com", "password", {
      id: faker.string.uuid(),
      email: "user@example.com",
      firstName: "Student",
      lastName: "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.student,
    });

    console.log("Created or found admin user:", adminUser);
    console.log("Created or found student user:", studentUser);

    await createUsers(5);
    console.log("Created users with credentials");

    await createNiceCourses(adminUser.id, db);
    console.log("✨✨✨Created created nice courses✨✨✨");

    const createdCategories = await createEntities(
      categories,
      8,
      (() => {
        let index = 0;
        return () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(3),
          archived: index++ % 2 === 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      })(),
    );
    console.log("Created categories");

    const createdTextBlocks = await createEntities(
      textBlocks,
      10,
      (() => {
        let index = 0;
        return () => ({
          id: faker.string.uuid(),
          title: faker.lorem.words(4),
          body: faker.lorem.paragraph(3),
          archived: index++ % 3 === 0,
          state: index % 2 === 0 ? STATES.published : STATES.draft,
          authorId: adminUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      })(),
    );
    const createdTextBlocksStatePublished = createdTextBlocks.filter(
      (textBlock) => textBlock.state === STATES.published,
    );
    console.log("Created text blocks");

    const createdQuestions = await createEntities(
      questions,
      10,
      (() => {
        let index = 0;
        return () => ({
          id: faker.string.uuid(),
          questionType: faker.helpers.arrayElement(["single_choice", "multiple_choice"]),
          questionBody: faker.lorem.paragraph(3),
          solutionExplanation: faker.lorem.paragraph(3),
          state: index++ % 2 === 0 ? STATES.published : STATES.draft,
          authorId: adminUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      })(),
    );
    const createdQuestionsStatePublished = createdQuestions.filter(
      (question) => question.state === STATES.published,
    );
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

    const createdFiles = await createEntities(files, 10, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(3),
      type: faker.helpers.arrayElement(["presentation", "external_presentation", "video"]),
      url: faker.internet.url(),
      state: faker.helpers.arrayElement([STATUS.draft.key, STATUS.published.key]),
      authorId: adminUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const createdFilesStatePublished = createdFiles.filter(
      (file) => file.state === STATES.published,
    );
    console.log("Created files");

    const createdCourses = await createCoursesWithLessons(
      adminUser.id,
      createdCategories,
      createdFilesStatePublished,
      createdTextBlocksStatePublished,
      createdQuestionsStatePublished,
    );
    console.log("Created courses with lessons and lesson items");

    const courseCount = Math.floor(createdCourses.length * 0.7);
    const selectedCourses = sampleSize(createdCourses, courseCount);
    console.log("Selected random courses for student from createdCourses");
    await createStudentCourses(selectedCourses, studentUser.id);
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
