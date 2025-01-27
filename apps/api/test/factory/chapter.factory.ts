import { faker } from "@faker-js/faker";
import { Factory } from "fishery";

import { chapters } from "src/storage/schema";

import type { InferSelectModel } from "drizzle-orm";
import type { DatabasePg } from "src/common";

export type ChapterTest = InferSelectModel<typeof chapters>;

export const createChapterFactory = (db: DatabasePg) => {
  return Factory.define<ChapterTest>(({ onCreate }) => {
    onCreate(async (chapter) => {
      const [inserted] = await db
        .insert(chapters)
        .values({
          ...chapter,
        })
        .returning();

      return inserted;
    });

    return {
      id: faker.string.uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: faker.commerce.productName(),
      courseId: "2990e3f6-0c2c-45c1-9099-41d7e069a415",
      authorId: "2990e3f6-0c2c-45c1-9099-41d7e069a415",
      isFreemium: false,
      displayOrder: faker.number.int({ min: 1, max: 100 }),
      lessonCount: faker.number.int({ min: 0, max: 20 }),
    };
  });
};
