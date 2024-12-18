import { type Static, Type } from "@sinclair/typebox";

import { USER_ROLES } from "./userRoles";

export const createUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  role: Type.Union([
    Type.Literal(USER_ROLES.ADMIN),
    Type.Literal(USER_ROLES.STUDENT),
    Type.Literal(USER_ROLES.TEACHER),
  ]),
});

export type CreateUserBody = Static<typeof createUserSchema>;
