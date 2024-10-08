import type { RecordJSON } from "adminjs";

export interface LessonItemRelation extends RecordJSON {
  params: {
    id: string;
    lesson_id?: string;
    lesson_item_type?: "text_block" | "file" | "question";
    display_order?: number;
    lesson_item_id?: string;
  };
}

export interface LessonItem extends RecordJSON {
  params: {
    id: string;
    title: string;
    type: "text_block" | "file" | "question";
    content: string;
    lesson_item_id?: string;
    display_order: number | null;
  };
}

export type TransformedLessonItem = LessonItem & {
  columnId: string;
};
