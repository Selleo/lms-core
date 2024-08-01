import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { credentials, users } from "../../storage/schema";
import { DatabasePg } from "src/common";
import { TestContext, createUnitTest } from "test/create-unit-test";
import { UsersService } from "../users.service";
import { createUserFactory } from "test/factory/user.factory";
import { truncateAllTables } from "test/helpers/test-helpers";

describe("UsersService", () => {
  let testContext: TestContext;
  let usersService: UsersService;
  let db: DatabasePg;
  let userFactory: ReturnType<typeof createUserFactory>;

  beforeAll(async () => {
    testContext = await createUnitTest();
    usersService = testContext.module.get(UsersService);
    db = testContext.db;
    userFactory = createUserFactory(db);
  }, 30000);

  afterAll(async () => {
    await testContext.teardown();
  });

  afterEach(async () => {
    await truncateAllTables(db);
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      const testUsers = Array.from({ length: 2 }, () => userFactory.build());
      await db.insert(users).values(testUsers);

      const result = await usersService.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe(testUsers[0].email);
      expect(result[1].email).toBe(testUsers[1].email);
    });
  });

  describe("getUserById", () => {
    it("should return a user by id", async () => {
      const [testUser] = await db
        .insert(users)
        .values({ email: "test@example.com" })
        .returning();

      const result = await usersService.getUserById(testUser.id);

      expect(result).toBeDefined();
      expect(result.email).toBe("test@example.com");
    });

    it("should throw NotFoundException if user not found", async () => {
      await expect(
        usersService.getUserById(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const [testUser] = await db
        .insert(users)
        .values({ email: "old@example.com" })
        .returning();

      const updatedUser = await usersService.updateUser(testUser.id, {
        email: "new@example.com",
      });

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, testUser.id));

      expect(updatedUser).toBeDefined();
      expect(updatedUser.email).toBe("new@example.com");
      expect(dbUser.email).toBe("new@example.com");
    });

    it("should throw NotFoundException if user not found", async () => {
      await expect(
        usersService.updateUser(crypto.randomUUID(), {
          email: "new@example.com",
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("changePassword", () => {
    it("should change user password when old password is correct", async () => {
      const oldPassword = "oldpassword";
      const newPassword = "newpassword";
      const oldHashedPassword = await bcrypt.hash(oldPassword, 10);

      const [testUser] = await db
        .insert(users)
        .values({ email: "test@example.com" })
        .returning();
      await db
        .insert(credentials)
        .values({ userId: testUser.id, password: oldHashedPassword });

      await usersService.changePassword(testUser.id, oldPassword, newPassword);

      const [updatedCredentials] = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, testUser.id));
      expect(updatedCredentials).toBeDefined();
      expect(
        await bcrypt.compare(newPassword, updatedCredentials.password),
      ).toBe(true);
    });

    it("should throw UnauthorizedException if old password is incorrect", async () => {
      const oldPassword = "oldpassword";
      const incorrectOldPassword = "wrongpassword";
      const newPassword = "newpassword";
      const oldHashedPassword = await bcrypt.hash(oldPassword, 10);

      const [testUser] = await db
        .insert(users)
        .values({ email: "test@example.com" })
        .returning();
      await db
        .insert(credentials)
        .values({ userId: testUser.id, password: oldHashedPassword });

      await expect(
        usersService.changePassword(
          testUser.id,
          incorrectOldPassword,
          newPassword,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw NotFoundException if user not found", async () => {
      await expect(
        usersService.changePassword(
          crypto.randomUUID(),
          "oldpassword",
          "newpassword",
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const [testUser] = await db
        .insert(users)
        .values({ email: "test@example.com" })
        .returning();

      await usersService.deleteUser(testUser.id);

      const [deletedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, testUser.id));
      expect(deletedUser).toBeUndefined();
    });

    it("should throw NotFoundException if user not found", async () => {
      await expect(
        usersService.deleteUser(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
