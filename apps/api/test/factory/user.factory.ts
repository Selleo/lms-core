import { faker } from "@faker-js/faker";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Factory } from "fishery";
import { credentials, users } from "../../src/storage/schema";
import { DatabasePg } from "src/common";
import hashPassword from "../../src/common/helpers/hashPassword";

type User = InferSelectModel<typeof users>;
export type UserWithCredentials = User & { credentials?: Credential };
type Credential = InferInsertModel<typeof credentials>;

export const credentialFactory = Factory.define<Credential>(() => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  password: faker.internet.password(),
  role: "student" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

class UserFactory extends Factory<UserWithCredentials> {
  withCredentials(credential: { password: string }) {
    return this.associations({
      credentials: credentialFactory.build(credential),
    });
  }
}

export const createUserFactory = (db: DatabasePg) => {
  return UserFactory.define(({ onCreate, associations }) => {
    onCreate(async (user) => {
      const [inserted] = await db.insert(users).values(user).returning();

      if (associations.credentials) {
        const [insertedCredential] = await db
          .insert(credentials)
          .values({
            ...associations.credentials,
            password: await hashPassword(associations.credentials.password),
            userId: inserted.id,
          })
          .returning();

        return {
          ...inserted,
          credentials: {
            ...insertedCredential,
            password: associations.credentials.password,
          },
        };
      }

      return inserted;
    });

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "student" as const,
    };
  });
};
