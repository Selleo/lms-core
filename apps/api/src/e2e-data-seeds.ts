import { LESSON_ITEM_TYPE, LESSON_TYPE } from "./lessons/lesson.type";
import { STATUS } from "./storage/schema/utils";

import type { NiceCourseData } from "./utils/types/test-types";

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
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "E2E Testing Text Block",
            body: "E2E Testing Text Block Body",
            state: "published",
          },
        ],
      },
    ],
  },
];
