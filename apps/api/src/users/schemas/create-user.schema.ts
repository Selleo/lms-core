import { type Static, Type } from "@sinclair/typebox";

import { USER_ROLES } from "./user-roles";

export const createUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  role: Type.Union([
    Type.Literal(USER_ROLES.admin),
    Type.Literal(USER_ROLES.student),
    Type.Literal(USER_ROLES.tutor),
  ]),
});

export type CreateUserBody = Static<typeof createUserSchema>;
