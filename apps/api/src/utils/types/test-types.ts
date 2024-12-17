import { Type } from "@sinclair/typebox";

import { chapterSchema } from "src/chapter/schemas/chapter.schema";
import { baseCourseSchema } from "src/courses/schemas/createCourse.schema";
import { lessonSchema } from "src/lesson/lesson.schem";

import type { Static} from "@sinclair/typebox";

const niceCourseData = Type.Intersect([
  Type.Omit(baseCourseSchema, ["categoryId"]),
  Type.Object({
    category: Type.String(),
    chapters: Type.Array(
      Type.Intersect([
        Type.Omit(chapterSchema, [
          "id",
          "lessonCount",
          "completedLessonCount",
          "chapterProgress",
          "isSubmitted",
          "quizScore",
        ]),
        Type.Object({
          displayOrder: Type.Number(),
          lessons: Type.Array(
            Type.Intersect([
              Type.Omit(lessonSchema, ["id", "fileS3Key", "fileType"]),
              Type.Partial(
                Type.Object({
                  questions: Type.Array(
                    Type.Object({
                      type: Type.String(),
                      title: Type.String(),
                      description: Type.Optional(Type.String()),
                      solutionExplanation: Type.Optional(Type.String()),
                      questionAnswers: Type.Optional(
                        Type.Array(
                          Type.Object({
                            optionText: Type.String(),
                            isCorrect: Type.Boolean(),
                            position: Type.Number(),
                          }),
                        ),
                      ),
                    }),
                  ),
                }),
              ),
            ]),
          ),
        }),
      ]),
    ),
  }),
]);

export type NiceCourseData = Static<typeof niceCourseData>;
