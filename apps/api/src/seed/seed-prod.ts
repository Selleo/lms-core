import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import hashPassword from "../common/helpers/hashPassword";
import { credentials, users } from "../storage/schema";
import { USER_ROLES } from "../user/schemas/userRoles";

import { seedTruncateAllTables } from "./seed-helpers";

import type { DatabasePg, UUIDType } from "../common";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env)) {
  throw new Error("DATABASE_URL not found on .env");
}

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql) as DatabasePg;

async function createOrFindUser(email: string, password: string, userData: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) return existingUser;

  const [newUser] = await db.insert(users).values(userData).returning();
  await insertCredential(newUser.id, password);
  return newUser;
}

async function insertCredential(userId: UUIDType, password: string) {
  const credentialData = {
    id: faker.string.uuid(),
    userId,
    password: await hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return (await db.insert(credentials).values(credentialData).returning())[0];
}

async function seedProduction() {
  await seedTruncateAllTables(db);

  try {
    const adminUser = await createOrFindUser("admin@example.com", "password", {
      id: faker.string.uuid(),
      email: "admin@example.com",
      firstName: faker.person.firstName(),
      lastName: "Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.ADMIN,
    });
    console.log("Created or found admin user:", adminUser);

    const studentUser = await createOrFindUser("user@example.com", "password", {
      id: faker.string.uuid(),
      email: "user@example.com",
      firstName: faker.person.firstName(),
      lastName: "Student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.STUDENT,
    });
    console.log("Created or found student user:", studentUser);

    const teacherUser = await createOrFindUser("teacher@example.com", "password", {
      id: faker.string.uuid(),
      email: "teacher@example.com",
      firstName: faker.person.firstName(),
      lastName: "Teacher",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.TEACHER,
    });
    console.log("Created or found teacher user:", teacherUser);

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    console.log("Closing database connection");
    try {
      await sql.end();
      console.log("Database connection closed successfully.");
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
  }
}

if (require.main === module) {
  seedProduction()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
}

export default seedProduction;
