import { type Static, Type } from "@sinclair/typebox";

import { USER_ROLES } from "./userRoles";

export const createUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  role: Type.Enum(USER_ROLES),
});

export type CreateUserBody = Static<typeof createUserSchema>;
