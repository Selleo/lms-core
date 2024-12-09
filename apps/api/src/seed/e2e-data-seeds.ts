import { LESSON_ITEM_TYPE, LESSON_TYPE } from "../lessons/lesson.type";
import { STATUS } from "../storage/schema/utils";

import type { NiceCourseData } from "../utils/types/test-types";

export const e2eCourses: NiceCourseData[] = [
  {
    title: "For E2E Testing",
    description: "DO NOT DELETE THIS COURSE.",
    state: "published",
    imageUrl: "https://placehold.co/600x400",
    priceInCents: 9900,
    currency: "USD",
    category: "E2E Testing",
    lessons: [
      {
        title: "E2E Testing Lesson",
        description: "E2E Testing Lesson Description",
        imageUrl: "https://placehold.co/600x400",
        type: LESSON_TYPE.multimedia.key,
        state: STATUS.published.key,
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "E2E Testing Text Block",
            body: "E2E Testing Text Block Body",
            state: "published",
          },
        ],
      },
      {
        title: "E2E Testing Quiz",
        description: "E2E Testing Quiz Description",
        imageUrl: "https://placehold.co/600x400",
        type: LESSON_TYPE.quiz.key,
        state: STATUS.published.key,
        isFree: true,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: "single_choice",
            questionBody: "E2E Testing Question",
            state: "published",
            questionAnswers: [
              {
                optionText: "E2E Testing Answer",
                isCorrect: true,
                position: 0,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: "single_choice",
            questionBody: "E2E Testing Question 2",
            state: "published",
            questionAnswers: [
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
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: "multiple_choice",
            questionBody: "E2E Testing Question 3",
            state: "published",
            questionAnswers: [
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
];
