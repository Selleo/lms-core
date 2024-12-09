import { faker } from "@faker-js/faker";
import { format, subMonths } from "date-fns";
import * as dotenv from "dotenv";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { flatMap, now, sampleSize } from "lodash";
import postgres from "postgres";

import hashPassword from "../common/helpers/hashPassword";
import { STATES } from "../common/states";
import { LESSON_ITEM_TYPE, LESSON_TYPE } from "../lessons/lesson.type";
import {
  courseLessons,
  courses,
  coursesSummaryStats,
  courseStudentsStats,
  credentials,
  lessonItems,
  lessons,
  quizAttempts,
  studentCourses,
  studentLessonsProgress,
  userDetails,
  users,
} from "../storage/schema";
import { STATUS } from "../storage/schema/utils";
import { USER_ROLES } from "../users/schemas/user-roles";

import { e2eCourses } from "./e2e-data-seeds";
import { niceCourses } from "./nice-data-seeds";
import { createNiceCourses, seedTruncateAllTables } from "./seed-helpers";
import { admin, students, teachers } from "./users-seed";

import type { UsersSeed } from "./seed.type";
import type { DatabasePg, UUIDType } from "../common";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env)) {
  throw new Error("DATABASE_URL not found on .env");
}

const connectionString = process.env.DATABASE_URL!;
const sqlConnect = postgres(connectionString);
const db = drizzle(sqlConnect) as DatabasePg;

async function createUsers(users: UsersSeed, password = faker.internet.password()) {
  return Promise.all(
    users.map(async (userData) => {
      const userToCreate = {
        id: faker.string.uuid(),
        email: userData.email || faker.internet.email(),
        firstName: userData.firstName || faker.person.firstName(),
        lastName: userData.lastName || faker.person.lastName(),
        role: userData.role || USER_ROLES.student,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const user = await createOrFindUser(userToCreate.email, password, userToCreate);

      return user;
    }),
  );
}

async function createOrFindUser(email: string, password: string, userData: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) return existingUser;

  const [newUser] = await db.insert(users).values(userData).returning();

  await insertCredential(newUser.id, password);

  if (newUser.role === USER_ROLES.admin || newUser.role === USER_ROLES.teacher)
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

async function createStudentCourses(courses: any[], studentIds: string[]) {
  const studentsCoursesList = studentIds.flatMap((studentId) => {
    const courseCount = Math.floor(courses.length * 0.5);
    const selectedCourses = sampleSize(courses, courseCount);

    return selectedCourses.map((course) => {
      return {
        id: faker.string.uuid(),
        studentId: studentId,
        courseId: course.id,
        numberOfAssignments: faker.number.int({ min: 0, max: 10 }),
        numberOfFinishedAssignments: faker.number.int({ min: 0, max: 10 }),
        state: "not_started",
        archived: false,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    });
  });

  return db.insert(studentCourses).values(studentsCoursesList).returning();
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

async function createCoursesSummaryStats(courses: any[] = []) {
  const createdCoursesSummaryStats = courses.map((course) => ({
    authorId: course.authorId,
    courseId: course.id,
    freePurchasedCount: faker.number.int({ min: 20, max: 40 }),
    paidPurchasedCount: faker.number.int({ min: 20, max: 40 }),
    paidPurchasedAfterFreemiumCount: faker.number.int({ min: 0, max: 20 }),
    completedFreemiumStudentCount: faker.number.int({ min: 40, max: 60 }),
    completedCourseStudentCount: faker.number.int({ min: 0, max: 20 }),
  }));

  return db.insert(coursesSummaryStats).values(createdCoursesSummaryStats);
}

async function createQuizAttempts(userId: string) {
  const quizzes = await db
    .select({ courseId: courses.id, lessonId: lessons.id, lessonItemsCount: lessons.itemsCount })
    .from(courses)
    .innerJoin(courseLessons, eq(courses.id, courseLessons.courseId))
    .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
    .where(and(eq(courses.state, STATES.published), eq(lessons.type, LESSON_TYPE.quiz.key)));

  const createdQuizAttempts = quizzes.map((quiz) => {
    const correctAnswers = faker.number.int({ min: 0, max: quiz.lessonItemsCount });

    return {
      userId,
      courseId: quiz.courseId,
      lessonId: quiz.lessonId,
      correctAnswers: correctAnswers,
      wrongAnswers: quiz.lessonItemsCount - correctAnswers,
      score: Math.round((correctAnswers / quiz.lessonItemsCount) * 100),
    };
  });

  return db.insert(quizAttempts).values(createdQuizAttempts);
}

function getLast12Months(): Array<{ month: number; year: number; formattedDate: string }> {
  const today = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = subMonths(today, index);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      formattedDate: format(date, "MMMM yyyy"),
    };
  }).reverse();
}

async function createCourseStudentsStats() {
  const createdCourses = await db
    .select({
      courseId: courses.id,
      authorId: courses.authorId,
    })
    .from(courses)
    .where(eq(courses.state, STATES.published));

  const twelveMonthsAgoArray = getLast12Months();

  const createdTwelveMonthsAgoStats = flatMap(createdCourses, (course) =>
    twelveMonthsAgoArray.map((monthDetails) => ({
      courseId: course.courseId,
      authorId: course.authorId,
      newStudentsCount: faker.number.int({ min: 5, max: 25 }),
      month: monthDetails.month,
      year: monthDetails.year,
    })),
  );

  await db.insert(courseStudentsStats).values(createdTwelveMonthsAgoStats);
}

async function seedStaging() {
  await seedTruncateAllTables(db);

  try {
    const createdStudents = await createUsers(students, "password");
    const [createdAdmin] = await createUsers(admin, "password");
    const createdTeachers = await createUsers(teachers, "password");
    await createUsers(
      [
        {
          email: "student0@example.com",
          firstName: faker.person.firstName(),
          lastName: "Student",
          role: USER_ROLES.student,
        },
      ],
      "password",
    );

    const createdStudentIds = createdStudents.map((student) => student.id);
    const creatorCourseIds = [createdAdmin.id, ...createdTeachers.map((teacher) => teacher.id)];

    console.log("Created or found admin user:", createdAdmin);
    console.log("Created or found students user:", createdStudents);
    console.log("Created or found teachers user:", createdTeachers);

    const createdCourses = await createNiceCourses(creatorCourseIds, db, niceCourses);
    console.log("✨✨✨Created created nice courses✨✨✨");
    await createNiceCourses([createdAdmin.id], db, e2eCourses);
    console.log("🧪 Created e2e courses");

    console.log("Selected random courses for student from createdCourses");
    await createStudentCourses(createdCourses, createdStudentIds);
    console.log("Created student courses");

    await Promise.all(
      createdStudentIds.map(async (studentId) => {
        await createLessonProgress(studentId);
      }),
    );
    console.log("Created student lesson progress");

    // TODO: change to function working on data from database as in real app
    await createCoursesSummaryStats(createdCourses);

    await Promise.all(
      createdStudentIds.map(async (studentId) => {
        await createQuizAttempts(studentId);
      }),
    );
    await createCourseStudentsStats();
    console.log("Created student course students stats");
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
  seedStaging()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
}

export default seedStaging;
