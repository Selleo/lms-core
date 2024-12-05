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
      Type.Literal(USER_ROLES.teacher),
    ]),
  ),
  archived: Type.Optional(Type.Boolean()),
});
export const upsertUserDetailsSchema = Type.Object({
  description: Type.Optional(Type.String()),
  contactEmail: Type.Optional(Type.String({ format: "email" })),
  contactPhoneNumber: Type.Optional(Type.String()),
  jobTitle: Type.Optional(Type.String()),
});

export type UpsertUserDetailsBody = Static<typeof upsertUserDetailsSchema>;
export type UpdateUserBody = Static<typeof updateUserSchema>;
