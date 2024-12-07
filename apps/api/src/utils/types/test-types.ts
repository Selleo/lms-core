import { Type } from "@sinclair/typebox";

import { baseCourseSchema } from "src/courses/schemas/createCourse.schema";
import { LESSON_ITEM_TYPE } from "src/lessons/lesson.type";
import { lesson } from "src/lessons/schemas/lesson.schema";
import {
  lessonItemFileSchema,
  questionAnswerOptionsSchema,
  questionSchema,
  textBlockSchema,
} from "src/lessons/schemas/lessonItem.schema";

import { STATUS } from "../../storage/schema/utils";

import type { Static } from "@sinclair/typebox";

const niceCourseData = Type.Intersect([
  Type.Omit(baseCourseSchema, ["categoryId"]),
  Type.Object({
    category: Type.String(),
    lessons: Type.Array(
      Type.Intersect([
        Type.Omit(lesson, ["id"]),
        Type.Object({
          state: Type.Union([Type.Literal(STATUS.draft.key), Type.Literal(STATUS.published.key)]),
          items: Type.Array(
            Type.Union([
              Type.Intersect([
                Type.Omit(lessonItemFileSchema, ["id", "archived", "authorId"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.file.key),
                }),
              ]),
              Type.Intersect([
                Type.Omit(textBlockSchema, ["id", "archived", "authorId"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.text_block.key),
                }),
              ]),
              Type.Intersect([
                Type.Omit(questionSchema, ["id", "archived", "authorId", "questionAnswers"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.question.key),
                  questionAnswers: Type.Optional(
                    Type.Array(Type.Omit(questionAnswerOptionsSchema, ["id", "questionId"])),
                  ),
                }),
              ]),
            ]),
          ),
        }),
      ]),
    ),
  }),
]);

export type NiceCourseData = Static<typeof niceCourseData>;
