import { LESSON_TYPES } from "src/lesson/lesson.type";

import type { NiceCourseData } from "../utils/types/test-types";
import { QUESTION_TYPE } from "src/questions/schema/question.types";

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
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
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
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "E2E Testing Quiz",
            description: "E2E Testing Quiz Description",
            displayOrder: 1,
            questions: [
              {
                id: crypto.randomUUID(),
                type: QUESTION_TYPE.SINGLE_CHOICE,
                title: "E2E Testing Question",
                description: "E2E Testing Question",
                displayOrder: 1,
                options: [
                  {
                    optionText: "E2E Testing Answer",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QUESTION_TYPE.SINGLE_CHOICE,
                title: "E2E Testing Question 2",
                description: "E2E Testing Question 2",
                displayOrder: 2,
                options: [
                  {
                    optionText: "single true",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    optionText: "single false",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QUESTION_TYPE.MULTIPLE_CHOICE,
                title: "E2E Testing Question 3",
                description: "E2E Testing Question 3",
                displayOrder: 3,
                options: [
                  {
                    optionText: "multiple true a",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    optionText: "multiple true b",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    optionText: "multiple false c",
                    isCorrect: false,
                    displayOrder: 3,
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
