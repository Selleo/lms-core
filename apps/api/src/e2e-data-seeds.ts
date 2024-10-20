import { faker } from "@faker-js/faker";
import { CourseData } from "./utils/types/test-types";

export const e2eCourses: CourseData[] = [
  {
    title: "For E2E Testing",
    description: "DO NOT DELETE THIS COURSE",
    state: "published",
    priceInCents: 9900,
    category: "E2E Testing",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        title: "E2E Testing Lesson",
        description: "E2E Testing Lesson Description",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "E2E Testing Text Block",
            body: "E2E Testing Text Block Body",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody: "E2E Testing Question Body",
            state: "published",
          },
        ],
      },
      {
        title: "E2E Testing Lesson 2",
        description: "E2E Testing Lesson 2 Description",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "E2E Testing Text Block 2",
            body: "E2E Testing Text Block 2 Body",
            state: "published",
          },
          {
            type: "file",
            title: "E2E Testing File",
            fileType: "external_video",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            state: "published",
          },
          {
            type: "question",
            questionType: "single_choice",
            questionBody: "E2E Testing Single Choice Question Body",
            state: "published",
          },
        ],
      },
      {
        title: "E2E Testing Lesson 3",
        description: "E2E Testing Lesson 3 Description",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "E2E Testing Text Block 3",
            body: "E2E Testing Text Block 3 Body",
            state: "published",
          },
          {
            type: "file",
            title: "E2E Testing File 2",
            fileType: "external_presentation",
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody: "E2E Testing Multiple Choice Question Body",
            state: "published",
          },
        ],
      },
    ],
  },
];
