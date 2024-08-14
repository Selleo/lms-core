import * as dotenv from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, credentials } from "./storage/schema";
import { DatabasePg } from "./common";
import { faker } from "@faker-js/faker";
import hashPassword from "./common/helpers/hashPassword";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env");

async function seed() {
  const connectionString = process.env.DATABASE_URL!;
  const testUserEmail = "user@example.com";
  const adminPassword = "password";

  const sql = postgres(connectionString);
  const db = drizzle(sql) as DatabasePg;

  try {
    const studentUserData = {
      id: faker.string.uuid(),
      email: testUserEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "student",
    } as const;

    const adminUserData = {
      id: faker.string.uuid(),
      email: "admin@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "admin",
    } as const;

    const [insertedStudentUser] = await db
      .insert(users)
      .values(studentUserData)
      .returning();

    const [insertedAdminUser] = await db
      .insert(users)
      .values(adminUserData)
      .returning();

    const adminCredentialData = {
      id: faker.string.uuid(),
      userId: insertedAdminUser.id,
      password: await hashPassword(adminPassword),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const studentCredentialData = {
      id: faker.string.uuid(),
      userId: insertedStudentUser.id,
      password: await hashPassword("studentpassword"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const [insertedAdminCredential] = await db
      .insert(credentials)
      .values(adminCredentialData)
      .returning();

    const [insertedStudentCredential] = await db
      .insert(credentials)
      .values(studentCredentialData)
      .returning();

    console.log("Created admin user:", {
      ...insertedStudentUser,
      credentials: {
        ...insertedStudentCredential,
        password: adminPassword,
      },
    });

    console.log("Created student user:", {
      ...insertedAdminUser,
      credentials: {
        ...insertedAdminCredential,
        password: adminPassword,
      },
    });

    const usersWithCredentials = await Promise.all(
      Array.from({ length: 5 }, async () => {
        const userData = {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const [insertedUser] = await db
          .insert(users)
          .values(userData)
          .returning();

        const password = faker.internet.password();
        const credentialData = {
          id: faker.string.uuid(),
          userId: insertedUser.id,
          password: await hashPassword(password),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const [insertedCredential] = await db
          .insert(credentials)
          .values(credentialData)
          .returning();

        return {
          ...insertedUser,
          credentials: {
            ...insertedCredential,
            password: password,
          },
        };
      }),
    );

    console.log("Created users with credentials:", usersWithCredentials);
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sql.end();
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
