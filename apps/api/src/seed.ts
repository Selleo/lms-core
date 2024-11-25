import { faker } from "@faker-js/faker";
import { format, subMonths } from "date-fns";
import * as dotenv from "dotenv";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { now, sampleSize } from "lodash";
import postgres from "postgres";

import hashPassword from "./common/helpers/hashPassword";
import { STATES } from "./common/states";
import { e2eCourses } from "./e2e-data-seeds";
import { LESSON_FILE_TYPE, LESSON_ITEM_TYPE, LESSON_TYPE } from "./lessons/lesson.type";
import { niceCourses } from "./nice-data-seeds";
import { createNiceCourses, seedTruncateAllTables } from "./seed-helpers";
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
  studentLessonsProgress,
  textBlocks,
  userDetails,
  users,
} from "./storage/schema";
import { STATUS } from "./storage/schema/utils";
import { USER_ROLES } from "./users/schemas/user-roles";

import type { DatabasePg, UUIDType } from "./common";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env)) {
  throw new Error("DATABASE_URL not found on .env");
}

const connectionString = process.env.DATABASE_URL!;
const sqlConnect = postgres(connectionString);
const db = drizzle(sqlConnect) as DatabasePg;

const external_video_urls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];

const external_presentation_urls = [
  "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
];

async function createOrFindUser(email: string, password: string, userData: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) return existingUser;

  const [newUser] = await db.insert(users).values(userData).returning();

  await insertCredential(newUser.id, password);

  if (newUser.role === USER_ROLES.admin || newUser.role === USER_ROLES.tutor)
    await insertUserDetails(newUser.id);

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

async function insertUserDetails(userId: string) {
  return await db.insert(userDetails).values({
    userId,
    description: faker.lorem.paragraph(3),
    contactEmail: faker.internet.email(),
    contactPhoneNumber: faker.phone.number(),
    jobTitle: faker.person.jobTitle(),
  });
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

async function createEntities<T = any>(
  table: any,
  count: number,
  dataGenerator: () => T,
): Promise<T[]> {
  const entities = Array.from({ length: count }, dataGenerator);
  return db.insert(table).values(entities).returning();
}

async function createCoursesWithLessons(
  adminUserIds: string[],
  categories: any[],
  existingFiles: any[],
  existingTextBlocks: any[],
  existingQuestions: any[],
) {
  const coursesData = [];
  const lessonsData = [];
  const lessonItemsData = [];
  const courseToLessonsMap = new Map<UUIDType, UUIDType[]>();

  for (let i = 0; i < 40; i++) {
    const courseId = faker.string.uuid();
    const isPublished = i < 36; // First 36 courses will be published, rest will be drafts

    const monthsToSubtract = i % 12;
    const createdDate = subMonths(now(), monthsToSubtract);
    const formattedCreatedDate = format(createdDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    const course = {
      id: courseId,
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(3),
      imageUrl: faker.image.urlPicsumPhotos(),
      state: isPublished ? STATUS.published.key : STATUS.draft.key,
      priceInCents: i % 3 === 0 ? faker.number.int({ min: 0, max: 1000 }) : 0,
      authorId: adminUserIds[i % 2 ? 0 : 1],
      categoryId: faker.helpers.arrayElement(categories).id,
      createdAt: formattedCreatedDate,
      updatedAt: formattedCreatedDate,
    };

    coursesData.push(course);

    if (isPublished) {
      const maxLessonCount = faker.number.int({ min: 3, max: 10 });
      const courseLessons = [];
      for (let j = 0; j < maxLessonCount; j++) {
        const lessonId = faker.string.uuid();
        const lesson = {
          id: lessonId,
          title: faker.lorem.sentence(3),
          description: faker.lorem.paragraph(3),
          imageUrl: faker.image.urlPicsumPhotos(),
          authorId: adminUserIds[j % 2 ? 0 : 1],
          state: STATUS.published.key,
          createdAt: formattedCreatedDate,
          updatedAt: formattedCreatedDate,
          itemsCount: 0,
        };
        courseLessons.push(lessonId);

        const newLessonItems = createLessonItems(
          lessonId,
          existingFiles,
          existingTextBlocks,
          existingQuestions,
        );
        lessonItemsData.push(...newLessonItems);

        lesson.itemsCount = newLessonItems.filter(
          (item) => item.lessonItemType !== LESSON_ITEM_TYPE.text_block.key,
        ).length;
        lessonsData.push(lesson);
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
          authorId: adminUserIds[j % 2 ? 0 : 1],
          state: STATUS.published.key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          itemsCount: 0,
        };
        courseLessons.push(lessonId);

        const newLessonItems = createLessonItems(
          lessonId,
          existingFiles,
          existingTextBlocks,
          existingQuestions,
        );
        lessonItemsData.push(...newLessonItems);

        lesson.itemsCount = newLessonItems.length;
        lessonsData.push(lesson);
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
  const allItems = [
    ...files.map((file) => ({ type: LESSON_ITEM_TYPE.file.key, item: file })),
    ...textBlocks.map((textBlock) => ({ type: LESSON_ITEM_TYPE.text_block.key, item: textBlock })),
    ...questions.map((question) => ({ type: LESSON_ITEM_TYPE.question.key, item: question })),
  ];

  const shuffledItems = faker.helpers.shuffle(allItems);

  const itemCount = faker.number.int({ min: 3, max: 10 });

  return shuffledItems.slice(0, itemCount).map((item, index) => ({
    id: faker.string.uuid(),
    lessonId: lessonId,
    lessonItemId: item.item.id,
    lessonItemType: item.type,
    displayOrder: index + 1,
  }));
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
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  }));

  return db.insert(studentCourses).values(studentCoursesList).returning();
}

async function createLessonProgress(userId: string) {
  const courseLessonsList = await db
    .select({
      lessonId: courseLessons.lessonId,
      courseId: courseLessons.courseId,
      createdAt: sql<string>`${courses.createdAt}`,
      lessonType: sql<string>`${lessons.type}`,
    })
    .from(courseLessons)
    .leftJoin(courses, eq(courseLessons.courseId, courses.id))
    .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
    .leftJoin(lessons, eq(courseLessons.lessonId, lessons.id))
    .where(eq(studentCourses.studentId, userId));

  const lessonProgressList = courseLessonsList.map((courseLesson) => {
    const lessonId = courseLesson.lessonId;
    const courseId = courseLesson.courseId;

    return {
      lessonId,
      courseId,
      studentId: userId,
      completedLessonItemCount: 0,
      createdAt: courseLesson.createdAt,
      updatedAt: courseLesson.createdAt,
      quizCompleted: courseLesson.lessonType === LESSON_TYPE.quiz.key ? false : null,
      quizScore: courseLesson.lessonType === LESSON_TYPE.quiz.key ? 0 : null,
    };
  });

  return db.insert(studentLessonsProgress).values(lessonProgressList).returning();
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

    const tutorUser = await createOrFindUser("tutor@example.com", "password", {
      id: faker.string.uuid(),
      email: "tutor@example.com",
      firstName: "Tutor",
      lastName: "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.tutor,
    });

    console.log("Created or found admin user:", adminUser);
    console.log("Created or found student user:", studentUser);
    console.log("Created or found tutor user:", tutorUser);

    await createUsers(5);
    console.log("Created users with credentials");

    await createNiceCourses(adminUser.id, db, niceCourses);
    console.log("✨✨✨Created created nice courses✨✨✨");
    await createNiceCourses(adminUser.id, db, e2eCourses);
    console.log("🧪 Created e2e courses");

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

    const createdFiles = await createEntities(files, 10, () => {
      const fileType = faker.helpers.arrayElement([
        LESSON_FILE_TYPE.external_presentation.key,
        LESSON_FILE_TYPE.external_video.key,
      ]);

      let url;
      if (fileType === LESSON_FILE_TYPE.external_video.key) {
        url = faker.helpers.arrayElement(external_video_urls);
      } else if (fileType === LESSON_FILE_TYPE.external_presentation.key) {
        url = faker.helpers.arrayElement(external_presentation_urls);
      } else {
        url = faker.internet.url();
      }

      return {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(3),
        type: fileType,
        url: url,
        state: faker.helpers.arrayElement([STATUS.draft.key, STATUS.published.key]),
        authorId: adminUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    const createdFilesStatePublished = createdFiles.filter(
      (file) => file.state === STATES.published,
    );
    console.log("Created files");

    const createdCourses = await createCoursesWithLessons(
      [adminUser.id, tutorUser.id],
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
    await createLessonProgress(studentUser.id);

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    console.log("Closing database connection");
    try {
      await sqlConnect.end();
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
