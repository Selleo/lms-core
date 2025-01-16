import { Type } from "@sinclair/typebox";

import { USER_ROLES } from "src/user/schemas/userRoles";

import type { Static } from "@sinclair/typebox";

export const user = Type.Object({
  role: Type.Enum(USER_ROLES),
  email: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
});

const userArray = Type.Array(user);

export type UsersSeed = Static<typeof userArray>;
