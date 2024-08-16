import { Static, Type } from "@sinclair/typebox";
import { UserRoles } from "src/users/schemas/user-roles";

export const createAccountSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export const createAccountSchemaWithRole = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  role: Type.Union([
    Type.Literal(UserRoles["admin"]),
    Type.Literal(UserRoles["tutor"]),
  ]),
});

export type CreateAccountBody = Static<typeof createAccountSchema>;
export type CreateAccountWithRoleBody = Static<
  typeof createAccountSchemaWithRole
>;
