import { LESSON_TYPES, QuestionType } from "src/lesson/lesson.type";

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
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            type: LESSON_TYPES.textBlock,
            title: "E2E Testing Text Block",
            description: "E2E Testing Text Block Body",
            displayOrder: 1,
          },
        ],
      },
      {
        title: "E2E Testing Quiz",
        isPublished: true,
        isFreemium: true,
        displayOrder: 2,
        lessons: [
          {
            type: LESSON_TYPES.quiz,
            title: "E2E Testing Quiz",
            description: "E2E Testing Quiz Description",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "E2E Testing Question",
                description: "E2E Testing Question",
                options: [
                  {
                    optionText: "E2E Testing Answer",
                    isCorrect: true,
                    position: 0,
                  },
                ],
              },
              {
                type: QuestionType.SingleChoice,
                title: "E2E Testing Question 2",
                description: "E2E Testing Question 2",
                options: [
                  {
                    optionText: "single true",
                    isCorrect: true,
                    position: 0,
                  },
                  {
                    optionText: "single false",
                    isCorrect: false,
                    position: 1,
                  },
                ],
              },
              {
                type: QuestionType.MultipleChoice,
                title: "E2E Testing Question 3",
                description: "E2E Testing Question 3",
                options: [
                  {
                    optionText: "multiple true a",
                    isCorrect: true,
                    position: 0,
                  },
                  {
                    optionText: "multiple true b",
                    isCorrect: false,
                    position: 1,
                  },
                  {
                    optionText: "multiple false c",
                    isCorrect: false,
                    position: 2,
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
