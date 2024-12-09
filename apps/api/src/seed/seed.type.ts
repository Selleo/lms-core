import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const user = Type.Object({
  role: Type.String(),
  email: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
});

const userArray = Type.Array(user);

export type UsersSeed = Static<typeof userArray>;
