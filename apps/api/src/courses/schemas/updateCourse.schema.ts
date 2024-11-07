import { type Static, Type } from "@sinclair/typebox";

import { STATES } from "src/common/states";

export const updateCourseSchema = Type.Partial(
  Type.Object({
    title: Type.String(),
    description: Type.String(),
    state: Type.Union([Type.Literal(STATES.draft), Type.Literal(STATES.published)]),
    priceInCents: Type.Integer(),
    currency: Type.String(),
    categoryId: Type.String({ format: "uuid" }),
    lessons: Type.Array(Type.String({ format: "uuid" })),
    archived: Type.Optional(Type.Boolean()),
  }),
);

export type UpdateCourseBody = Static<typeof updateCourseSchema>;
