import { sql } from "drizzle-orm";
import request from "supertest";

import type { DatabasePg } from "../../src/common";
import type { INestApplication } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import type { UserWithCredentials } from "test/factory/user.factory";

type CamelToSnake<T extends string, P extends string = ""> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
    ? CamelToSnake<R, `${P}${C0 extends Lowercase<C0> ? "" : "_"}${Lowercase<C0>}`>
    : P;

type StringKeys<T> = Extract<keyof T, string>;

export function environmentVariablesFactory() {
  return {
    get: jest.fn((key: string) => {
      switch (key) {
        case "JWT_SECRET":
          return "secret";
        case "DEBUG":
          return "false";
      }
    }),
  };
}

export function signInAs(userId: string, jwtService: JwtService): string {
  return jwtService.sign({ sub: userId });
}

export async function truncateAllTables(connection: DatabasePg): Promise<void> {
  const tables = connection._.tableNamesMap;

  for (const table of Object.keys(tables)) {
    await connection.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE;`));
  }
}

export async function truncateTables(
  connection: DatabasePg,
  tables: Array<CamelToSnake<StringKeys<NonNullable<DatabasePg["_"]["schema"]>>>>,
): Promise<void> {
  for (const table of tables) {
    await connection.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE;`));
  }
}

export async function cookieFor(user: UserWithCredentials, app: INestApplication<any>) {
  const loginResponse = await request(app.getHttpServer()).post("/api/auth/login").send({
    email: user.email,
    password: user.credentials?.password,
  });

  return loginResponse.headers["set-cookie"];
}
