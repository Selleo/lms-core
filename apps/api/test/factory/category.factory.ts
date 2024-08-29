import { categories } from "../../src/storage/schema";
import { DatabasePg } from "src/common";
import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { InferInsertModel } from "drizzle-orm";

type Category = InferInsertModel<typeof categories>;

export const createCategoryFactory = (db: DatabasePg) => {
  return Factory.define<Category>(({ onCreate }) => {
    onCreate(async (category) => {
      const [inserted] = await db
        .insert(categories)
        .values(category)
        .returning();
      return inserted;
    });

    const randomHex = Math.floor(Math.random() * 100000000).toString(16);

    return {
      id: faker.string.uuid(),
      title: faker.commerce.department() + randomHex,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };
  });
};
