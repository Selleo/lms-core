import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import hashPassword from "../../common/helpers/hashPassword";
import { USER_ROLES } from "../../users/schemas/user-roles";
import { credentials, users } from "../schema";

import type { DatabasePg } from "../../common";

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

async function seed() {
  try {
    const adminUser = await createOrFindUser("admin@example.com", "password", {
      id: faker.string.uuid(),
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.admin,
    });

    console.log("Created or found admin user:", adminUser);
    const studentUser = await createOrFindUser("user@example.com", "password", {
      id: faker.string.uuid(),
      email: "user@example.com",
      firstName: "Student",
      lastName: "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: USER_ROLES.student,
    });
    console.log("Created or found student user:", studentUser);

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
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
}

export default seed;
