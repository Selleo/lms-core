import { faker } from "@faker-js/faker";
import { Factory } from "fishery";

import hashPassword from "../../src/common/helpers/hashPassword";
import { credentials, users } from "../../src/storage/schema";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { DatabasePg } from "src/common";

type User = InferSelectModel<typeof users>;
export type UserWithCredentials = User & { credentials?: Credential };
type Credential = InferInsertModel<typeof credentials>;

export const credentialFactory = Factory.define<Credential>(() => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  role: "student" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  archived: false,
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
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "student" as const,
      archived: false,
    };
  });
};
