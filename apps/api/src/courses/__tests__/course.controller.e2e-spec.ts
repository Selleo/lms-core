import request from "supertest";

import { FileService } from "src/file/file.service";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { createE2ETest } from "../../../test/create-e2e-test";
import { createCategoryFactory } from "../../../test/factory/category.factory";
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
  const password = "password123";

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await truncateTables(db, ["courses"]);
  });

  describe("GET /api/course", () => {
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
    });
  });
});
