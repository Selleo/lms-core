import { Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const jwtPayloadSchema = Type.Object({
  userId: UUIDSchema,
  email: Type.String({ format: "email" }),
});

export type JwtPayload = Static<typeof jwtPayloadSchema>;
