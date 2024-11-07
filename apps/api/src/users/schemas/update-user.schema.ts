import { type Static, Type } from "@sinclair/typebox";

import { USER_ROLES } from "./user-roles";

export const updateUserSchema = Type.Object({
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: "email" })),
  role: Type.Optional(
    Type.Union([
      Type.Literal(USER_ROLES.admin),
      Type.Literal(USER_ROLES.student),
      Type.Literal(USER_ROLES.tutor),
    ]),
  ),
  archived: Type.Optional(Type.Boolean()),
});

export type UpdateUserBody = Static<typeof updateUserSchema>;
