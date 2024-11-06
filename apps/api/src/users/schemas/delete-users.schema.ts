import { type Static, Type } from "@sinclair/typebox";

export const deleteUsersSchema = Type.Object({
  userIds: Type.Array(Type.String()),
});

export type DeleteUsersSchema = Static<typeof deleteUsersSchema>;
