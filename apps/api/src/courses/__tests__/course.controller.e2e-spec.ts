import request from "supertest";

import { FileService } from "src/file/file.service";
import { coursesSummaryStats, studentCourses } from "src/storage/schema";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { createE2ETest } from "../../../test/create-e2e-test";
import { createCategoryFactory } from "../../../test/factory/category.factory";
import { createChapterFactory } from "../../../test/factory/chapter.factory";
import { createCourseFactory } from "../../../test/factory/course.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { cookieFor, truncateTables } from "../../../test/helpers/test-helpers";

import type { INestApplication } from "@nestjs/common";
import type { DatabasePg } from "src/common";

describe("CourseController (e2e)", () => {
  let app: INestApplication;
  let db: DatabasePg;
  let categoryFactory: ReturnType<typeof createCategoryFactory>;
  let userFactory: ReturnType<typeof createUserFactory>;
  let courseFactory: ReturnType<typeof createCourseFactory>;
  let chapterFactory: ReturnType<typeof createChapterFactory>;
  const password = "password123";

  beforeAll(async () => {
    // It can be crashed, test and reapir it later
    const mockFileService = {
      getFileUrl: jest.fn().mockResolvedValue("http://example.com/file"),
    };

    const mockCacheManager = {
      get: jest.fn().mockResolvedValue(""),
      set: jest.fn().mockResolvedValue(""),
    };
    const { app: testApp } = await createE2ETest([
      {
        provide: FileService,
        useValue: mockFileService,
      },
      {
        provide: "CACHE_MANAGER",
        useValue: mockCacheManager,
      },
    ]);

    app = testApp;
    db = app.get("DB");
    userFactory = createUserFactory(db);
    categoryFactory = createCategoryFactory(db);
    courseFactory = createCourseFactory(db);
    chapterFactory = createChapterFactory(db);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await truncateTables(db, ["courses"]);
  });

  describe("GET /api/course/all", () => {
    describe("when user is not logged in", () => {
      it("returns 401 for unauthorized request", async () => {
        await request(app.getHttpServer()).get("/api/course/all").expect(401);
      });
    });

    describe("when user is logged in", () => {
      describe("when user is admin", () => {
        it("returns 200 and all course list", async () => {
          const category = await categoryFactory.create();
          const author = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.ADMIN });
          await courseFactory.create({
            authorId: author.id,
            categoryId: category.id,
            isPublished: true,
            thumbnailS3Key: null,
          });

          const cookies = await cookieFor(author, app);

          const response = await request(app.getHttpServer())
            .get("/api/course/all")
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(response.body.data.length).toBe(1);
        });
      });

      describe("when user is student", () => {
        it("returns 403 for unauthorized request", async () => {
          const category = await categoryFactory.create();
          const author = await userFactory.withAdminRole().create();
          await courseFactory.create({ authorId: author.id, categoryId: category.id });
          const user = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.STUDENT });

          await request(app.getHttpServer())
            .get("/api/course/all")
            .set("Cookie", await cookieFor(user, app))
            .expect(403);
        });
      });

      describe("when user is teacher", () => {
        it("returns only courses created by the teacher", async () => {
          const category = await categoryFactory.create();
          const teacher = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.TEACHER });
          const otherTeacher = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.TEACHER });

          await courseFactory.create({
            authorId: teacher.id,
            categoryId: category.id,
            isPublished: true,
            thumbnailS3Key: null,
          });
          await courseFactory.create({
            authorId: otherTeacher.id,
            categoryId: category.id,
            isPublished: true,
            thumbnailS3Key: null,
          });

          const cookies = await cookieFor(teacher, app);
          const response = await request(app.getHttpServer())
            .get("/api/course/all")
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data).toBeDefined();
          expect(response.body.data.length).toBe(1);
          expect(response.body.data[0].author).toBe(`${teacher.firstName} ${teacher.lastName}`);
        });
      });

      describe("filtering", () => {
        it("filters by title", async () => {
          const admin = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.ADMIN });
          const cookies = await cookieFor(admin, app);
          const category = await categoryFactory.create();
          await courseFactory.create({
            title: "Python Course",
            authorId: admin.id,
            categoryId: category.id,
            thumbnailS3Key: null,
          });
          await courseFactory.create({
            title: "JavaScript Course",
            authorId: admin.id,
            categoryId: category.id,
            thumbnailS3Key: null,
          });

          const response = await request(app.getHttpServer())
            .get("/api/course/all?title=Python")
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data.length).toBe(1);
          expect(response.body.data[0].title).toContain("Python");
        });

        it("filters by date range", async () => {
          const admin = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.ADMIN });
          const cookies = await cookieFor(admin, app);
          const category = await categoryFactory.create();
          const pastDate = new Date("2023-01-01");
          const futureDate = new Date("2025-01-01");

          await courseFactory.create({
            authorId: admin.id,
            categoryId: category.id,
            createdAt: pastDate.toISOString(),
            thumbnailS3Key: null,
          });

          const response = await request(app.getHttpServer())
            .get(
              `/api/course/all?creationDateRange[0]=${futureDate.toISOString()}&creationDateRange[1]=${futureDate.toISOString()}&creationDateRangeStart=${futureDate.toISOString()}`,
            )
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data.length).toBe(0);
        });
      });

      describe("pagination", () => {
        it("respects page and perPage parameters", async () => {
          const category = await categoryFactory.create();
          const admin = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.ADMIN });

          for (let i = 0; i < 15; i++) {
            await courseFactory.create({
              authorId: admin.id,
              categoryId: category.id,
              thumbnailS3Key: null,
            });
          }

          const cookies = await cookieFor(admin, app);
          const response = await request(app.getHttpServer())
            .get("/api/course/all?page=2&perPage=5")
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data.length).toBe(5);
          expect(response.body.pagination).toEqual({
            totalItems: 15,
            page: 2,
            perPage: 5,
          });
        });
      });

      describe("sorting by -title", () => {
        it("sorts by title descending", async () => {
          const category = await categoryFactory.create();
          const admin = await userFactory
            .withCredentials({ password })
            .create({ role: USER_ROLES.ADMIN });

          await courseFactory.create({
            title: "Z Course",
            authorId: admin.id,
            categoryId: category.id,
            thumbnailS3Key: null,
          });
          await courseFactory.create({
            title: "A Course",
            authorId: admin.id,
            categoryId: category.id,
            thumbnailS3Key: null,
          });

          const cookies = await cookieFor(admin, app);
          const response = await request(app.getHttpServer())
            .get("/api/course/all?sort=-title")
            .set("Cookie", cookies)
            .expect(200);

          expect(response.body.data[0].title).toBe("Z Course");
          expect(response.body.data[1].title).toBe("A Course");
        });
      });
    });
  });

  describe("GET /api/course/get-student-courses", () => {
    describe("when user is not logged in", () => {
      it("returns 401", async () => {
        await request(app.getHttpServer()).get("/api/course/get-student-courses").expect(401);
      });
    });

    describe("when user is logged in", () => {
      it("returns only courses enrolled by student", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const enrolledCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        await db.insert(studentCourses).values({
          studentId: student.id,
          courseId: enrolledCourse.id,
          finishedChapterCount: 0,
        });

        const response = await request(app.getHttpServer())
          .get("/api/course/get-student-courses")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBe(enrolledCourse.id);
      });

      it("filters by title", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const pythonCourse = await courseFactory.create({
          title: "Python Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });
        const jsCourse = await courseFactory.create({
          title: "JavaScript Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        await db.insert(studentCourses).values([
          {
            studentId: student.id,
            courseId: pythonCourse.id,
            finishedChapterCount: 0,
          },
          {
            studentId: student.id,
            courseId: jsCourse.id,
            finishedChapterCount: 0,
          },
        ]);

        const response = await request(app.getHttpServer())
          .get("/api/course/get-student-courses?title=Python")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].title).toBe("Python Course");
      });

      it("returns only published courses", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const publishedCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });
        const unpublishedCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: false,
          thumbnailS3Key: null,
        });

        await db.insert(studentCourses).values([
          {
            studentId: student.id,
            courseId: publishedCourse.id,
            finishedChapterCount: 0,
          },
          {
            studentId: student.id,
            courseId: unpublishedCourse.id,
            finishedChapterCount: 0,
          },
        ]);

        const response = await request(app.getHttpServer())
          .get("/api/course/get-student-courses")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBe(publishedCourse.id);
      });

      it("sorts by -title", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const courseA = await courseFactory.create({
          title: "A Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });
        const courseZ = await courseFactory.create({
          title: "Z Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        await db.insert(studentCourses).values([
          {
            studentId: student.id,
            courseId: courseA.id,
            finishedChapterCount: 0,
          },
          {
            studentId: student.id,
            courseId: courseZ.id,
            finishedChapterCount: 0,
          },
        ]);

        const response = await request(app.getHttpServer())
          .get("/api/course/get-student-courses?sort=-title")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data[0].title).toBe("Z Course");
        expect(response.body.data[1].title).toBe("A Course");
      });

      it("paginates results", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const coursesToCreate = Array.from({ length: 15 }, (_, i) => ({
          title: `Course ${i}`,
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        }));

        const courses = await Promise.all(
          coursesToCreate.map((course) => courseFactory.create(course)),
        );

        await db.insert(studentCourses).values(
          courses.map((course) => ({
            studentId: student.id,
            courseId: course.id,
            finishedChapterCount: 0,
          })),
        );

        const response = await request(app.getHttpServer())
          .get("/api/course/get-student-courses?page=2&perPage=5")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(5);
        expect(response.body.pagination).toEqual({
          totalItems: 15,
          page: 2,
          perPage: 5,
        });
      });
    });
  });

  describe("GET /api/course/available-courses", () => {
    describe("when user is not logged in", () => {
      it("returns 401", async () => {
        await request(app.getHttpServer()).get("/api/course/available-courses").expect(401);
      });
    });

    describe("when user is logged in", () => {
      it("returns only published courses that user is not enrolled in", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const enrolledCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        const availableCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: false,
          thumbnailS3Key: null,
        });

        await db.insert(studentCourses).values({
          studentId: student.id,
          courseId: enrolledCourse.id,
          finishedChapterCount: 0,
        });

        const response = await request(app.getHttpServer())
          .get("/api/course/available-courses")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBe(availableCourse.id);
      });

      it("filters by title", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        await courseFactory.create({
          title: "Python Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });
        await courseFactory.create({
          title: "JavaScript Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        const response = await request(app.getHttpServer())
          .get("/api/course/available-courses?title=Python")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].title).toBe("Python Course");
      });

      it("excludes specified course", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const courseToExclude = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        const includedCourse = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        const response = await request(app.getHttpServer())
          .get(`/api/course/available-courses?excludeCourseId=${courseToExclude.id}`)
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBe(includedCourse.id);
      });

      it("includes course chapter count and free chapters info", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const course = await courseFactory.create({
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
          chapterCount: 5,
        });

        await chapterFactory.create({
          courseId: course.id,
          authorId: teacher.id,
          title: "Free Chapter",
          isFreemium: true,
          displayOrder: 1,
        });

        const response = await request(app.getHttpServer())
          .get("/api/course/available-courses")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data[0].courseChapterCount).toBe(5);
        expect(response.body.data[0].hasFreeChapters).toBe(true);
      });

      it("sorts by -title", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        await courseFactory.create({
          title: "A Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });
        await courseFactory.create({
          title: "Z Course",
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        });

        const response = await request(app.getHttpServer())
          .get("/api/course/available-courses?sort=-title")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data[0].title).toBe("Z Course");
        expect(response.body.data[1].title).toBe("A Course");
      });

      it("paginates results", async () => {
        const student = await userFactory
          .withCredentials({ password })
          .create({ role: USER_ROLES.STUDENT });
        const cookies = await cookieFor(student, app);
        const category = await categoryFactory.create();
        const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

        const coursesToCreate = Array.from({ length: 15 }, (_, i) => ({
          title: `Course ${i}`,
          authorId: teacher.id,
          categoryId: category.id,
          isPublished: true,
          thumbnailS3Key: null,
        }));

        await Promise.all(coursesToCreate.map((course) => courseFactory.create(course)));

        const response = await request(app.getHttpServer())
          .get("/api/course/available-courses?page=2&perPage=5")
          .set("Cookie", cookies)
          .expect(200);

        expect(response.body.data.length).toBe(5);
        expect(response.body.pagination).toEqual({
          totalItems: 15,
          page: 2,
          perPage: 5,
        });
      });
    });

    it("correctly shows enrolled participant count and pricing", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const cookies = await cookieFor(student, app);
      const category = await categoryFactory.create();
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });

      const course = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
        priceInCents: 2999,
        currency: "usd",
      });

      await db.insert(coursesSummaryStats).values({
        courseId: course.id,
        authorId: teacher.id,
        freePurchasedCount: 1,
        paidPurchasedCount: 1,
        paidPurchasedAfterFreemiumCount: 1,
        completedFreemiumStudentCount: 2,
        completedCourseStudentCount: 1,
      });

      const response = await request(app.getHttpServer())
        .get("/api/course/available-courses")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data[0].enrolledParticipantCount).toBe(2);
      expect(response.body.data[0].priceInCents).toBe(2999);
      expect(response.body.data[0].currency).toBe("usd");
    });
  });

  describe("GET /api/course/teacher-courses", () => {
    it("returns 401 when not logged in", async () => {
      await request(app.getHttpServer()).get("/api/course/teacher-courses").expect(401);
    });

    it("returns only published courses by specified teacher", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const otherTeacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      const publishedCourse = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: false,
        thumbnailS3Key: null,
      });

      await courseFactory.create({
        authorId: otherTeacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/course/teacher-courses?authorId=${teacher.id}`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(publishedCourse.id);
    });

    it("returns only enrolled courses when scope is ENROLLED", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      const enrolledCourse = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      await db.insert(studentCourses).values({
        studentId: student.id,
        courseId: enrolledCourse.id,
        finishedChapterCount: 0,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/course/teacher-courses?authorId=${teacher.id}&scope=enrolled`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(enrolledCourse.id);
      expect(response.body.data[0].enrolled).toBe(true);
    });

    it("returns available courses when scope is AVAILABLE", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      const availableCourse = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      const enrolledCourse = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      await db.insert(studentCourses).values({
        studentId: student.id,
        courseId: enrolledCourse.id,
        finishedChapterCount: 0,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/course/teacher-courses?authorId=${teacher.id}&scope=available`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(availableCourse.id);
      expect(response.body.data[0].enrolled).toBe(false);
    });

    it("excludes specified course", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      const courseToExclude = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      const courseToInclude = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      const response = await request(app.getHttpServer())
        .get(
          `/api/course/teacher-courses?authorId=${teacher.id}&excludeCourseId=${courseToExclude.id}&scope=available`,
        )
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(courseToInclude.id);
    });

    it("shows teacher details correctly", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({
        role: USER_ROLES.TEACHER,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/course/teacher-courses?authorId=${teacher.id}`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data[0].author).toBe("John Doe");
      expect(response.body.data[0].authorEmail).toBe("john@example.com");
      expect(response.body.data[0].authorId).toBe(teacher.id);
    });

    it("correctly shows course details with free chapters", async () => {
      const student = await userFactory
        .withCredentials({ password })
        .create({ role: USER_ROLES.STUDENT });
      const teacher = await userFactory.create({ role: USER_ROLES.TEACHER });
      const category = await categoryFactory.create();
      const cookies = await cookieFor(student, app);

      const course = await courseFactory.create({
        authorId: teacher.id,
        categoryId: category.id,
        isPublished: true,
        thumbnailS3Key: null,
        chapterCount: 3,
        priceInCents: 1999,
        currency: "usd",
      });

      await chapterFactory.create({
        courseId: course.id,
        authorId: teacher.id,
        isFreemium: true,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/course/teacher-courses?authorId=${teacher.id}`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data[0].courseChapterCount).toBe(3);
      expect(response.body.data[0].hasFreeChapters).toBe(true);
      expect(response.body.data[0].priceInCents).toBe(1999);
      expect(response.body.data[0].currency).toBe("usd");
    });
  });
});
