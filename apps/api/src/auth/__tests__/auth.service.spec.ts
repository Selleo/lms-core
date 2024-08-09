import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { credentials, users } from "../../storage/schema";
import { DatabasePg } from "src/common";
import { createUnitTest, TestContext } from "test/create-unit-test";
import { createUserFactory } from "test/factory/user.factory";
import { omit } from "lodash";
import hashPassword from "src/common/helpers/hashPassword";
import { truncateAllTables } from "test/helpers/test-helpers";
import { EmailTestingAdapter } from "test/helpers/test-email.adapter";
import { EmailAdapter } from "src/common/emails/adapters/email.adapter";

describe("AuthService", () => {
  let testContext: TestContext;
  let authService: AuthService;
  let jwtService: JwtService;
  let db: DatabasePg;
  let userFactory: ReturnType<typeof createUserFactory>;
  let emailAdapter: EmailTestingAdapter;

  beforeAll(async () => {
    testContext = await createUnitTest();
    authService = testContext.module.get(AuthService);
    jwtService = testContext.module.get(JwtService);
    db = testContext.db;
    userFactory = createUserFactory(db);
    emailAdapter = testContext.module.get(EmailAdapter);
  }, 30000);

  afterEach(async () => {
    await truncateAllTables(db);
    emailAdapter.clearEmails();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const user = userFactory.build();
      const password = "password123";

      const result = await authService.register(user.email, password);

      const [savedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email));

      const [savedCredentials] = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, savedUser.id));

      expect(savedUser).toBeDefined();
      expect(result).toBeDefined();
      expect(result.email).toBe(user.email);
      expect(savedCredentials).toBeDefined();
      expect(await bcrypt.compare(password, savedCredentials.password)).toBe(
        true,
      );
    });

    it("should send a welcome email after successful registration", async () => {
      const user = userFactory.build();
      const password = "password123";

      const allEmails = emailAdapter.getAllEmails();

      expect(allEmails).toHaveLength(0);
      await authService.register(user.email, password);
      expect(allEmails).toHaveLength(1);
    });

    it("should throw ConflictException if user already exists", async () => {
      const email = "existing@example.com";
      const user = await userFactory.create({ email });

      await expect(
        authService.register(user.email, "password123"),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const password = "password123";
      const email = "example@test.com";
      const user = await userFactory
        .withCredentials({ password })
        .create({ email });

      const result = await authService.login({
        email: user.email,
        password,
      });

      const decodedToken = await jwtService.verifyAsync(result.accessToken);

      expect(decodedToken.userId).toBe(user.id);
      expect(result).toMatchObject({
        ...omit(user, "credentials"),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it("should throw UnauthorizedException for invalid email", async () => {
      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException for invalid password", async () => {
      const user = await userFactory.create({ email: "example@test.com" });

      await expect(
        authService.login({
          email: user.email,
          password: "wrongpassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("validateUser", () => {
    it("should validate user successfully", async () => {
      const email = "test@example.com";
      const password = "password123";
      const hashedPassword = await hashPassword(password);

      const [user] = await db.insert(users).values({ email }).returning();
      await db
        .insert(credentials)
        .values({ userId: user.id, password: hashedPassword });

      const result = await authService.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result!.email).toBe(email);
    });

    it("should return null for invalid credentials", async () => {
      const email = "test@example.com";
      const password = "password123";

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe("currentUser", () => {
    it("should return current user data", async () => {
      const user = await userFactory.create();

      const result = await authService.currentUser(user.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
    });

    it("should throw UnauthorizedException for non-existent user", async () => {
      const nonExistentUserId = crypto.randomUUID();

      await expect(authService.currentUser(nonExistentUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
