import { Status } from "src/storage/schema/utils";

export const LessonFileType = {
  presentation: "Presentation",
  external_presentation: "External Presentation",
  video: "Video",
  external_video: "External Video",
} as const;

export const QuestionType = {
  open_answer: "Open Answer",
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
} as const;

export interface CourseData {
  title: string;
  description: string;
  imageUrl?: string;
  state: keyof typeof Status;
  priceInCents: number;
  category: string;
  lessons: {
    title: string;
    description: string;
    state: keyof typeof Status;
    items: Array<
      | {
          type: "text_block";
          title: string;
          body: string;
          state: keyof typeof Status;
        }
      | {
          type: "file";
          title: string;
          fileType: keyof typeof LessonFileType;
          url: string;
          state: keyof typeof Status;
        }
      | {
          type: "question";
          questionType: keyof typeof QuestionType;
          questionBody: string;
          state: keyof typeof Status;
        }
    >;
  }[];
}
