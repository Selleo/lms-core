import { LESSON_TYPES } from "src/lesson/lesson.type";
import { QUESTION_TYPE } from "src/questions/schema/question.types";

import type { NiceCourseData } from "../utils/types/test-types";

export const e2eCourses: NiceCourseData[] = [
  {
    title: "For E2E Testing",
    description: "DO NOT DELETE THIS COURSE.",
    isPublished: true,
    priceInCents: 9900,
    category: "E2E Testing",
    thumbnailS3Key: "https://placehold.co/600x400",
    chapters: [
      {
        title: "E2E Testing Lesson",
        isFreemium: false,
        lessons: [
          {
            type: LESSON_TYPES.TEXT,
            title: "E2E Testing Text Block",
            description: "E2E Testing Text Block Body",
          },
        ],
      },
      {
        title: "E2E Testing Quiz",
        isFreemium: true,
        lessons: [
          {
            type: LESSON_TYPES.QUIZ,
            title: "E2E Testing Quiz",
            description: "E2E Testing Quiz Description",
            questions: [
              {
                type: QUESTION_TYPE.SINGLE_CHOICE,
                title: "E2E Testing Question",
                description: "E2E Testing Question",
                options: [
                  {
                    optionText: "E2E Testing Answer",
                    isCorrect: true,
                  },
                ],
              },
              {
                type: QUESTION_TYPE.SINGLE_CHOICE,
                title: "E2E Testing Question 2",
                description: "E2E Testing Question 2",
                options: [
                  {
                    optionText: "single true",
                    isCorrect: true,
                  },
                  {
                    optionText: "single false",
                    isCorrect: false,
                  },
                ],
              },
              {
                type: QUESTION_TYPE.MULTIPLE_CHOICE,
                title: "E2E Testing Question 3",
                description: "E2E Testing Question 3",
                options: [
                  {
                    optionText: "multiple true a",
                    isCorrect: true,
                  },
                  {
                    optionText: "multiple true b",
                    isCorrect: false,
                  },
                  {
                    optionText: "multiple false c",
                    isCorrect: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
