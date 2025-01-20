import { faker } from "@faker-js/faker";
import { Factory } from "fishery";

import { courses } from "../../src/storage/schema";

import type { InferSelectModel } from "drizzle-orm";
import type { DatabasePg } from "src/common";

export type CourseTest = InferSelectModel<typeof courses>;

export const createCourseFactory = (db: DatabasePg) => {
  return Factory.define<CourseTest>(({ onCreate }) => {
    onCreate(async (course) => {
      const [inserted] = await db
        .insert(courses)
        .values({
          ...course,
        })
        .returning();

      return inserted;
    });

    const randomHex = Math.floor(Math.random() * 100000000).toString(16);

    return {
      id: faker.string.uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: faker.commerce.department() + randomHex,
      description: faker.commerce.productDescription(),
      thumbnailS3Key: faker.system.directoryPath(),
      isPublished: true,
      priceInCents: faker.number.int({ min: 1000, max: 100000 }),
      currency: "usd",
      chapterCount: faker.number.int({ min: 1, max: 20 }),
      authorId: "2990e3f6-0c2c-45c1-9099-41d7e069a415",
      categoryId: "406054f3-dc49-4598-8a38-a72fe5d7a11b",
      isScorm: false,
    };
  });
};
