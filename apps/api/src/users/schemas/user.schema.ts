import { Type, Static } from "@sinclair/typebox";
import { commonUserSchema } from "src/common/schemas/common-user.schema";

export const allUsersSchema = Type.Array(commonUserSchema);

export type UserResponse = Static<typeof commonUserSchema>;
export type AllUsersResponse = Static<typeof allUsersSchema>;
