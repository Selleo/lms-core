import type { LessonItem } from "./types.js";
import { ApiClient, RecordJSON } from "adminjs";

export const fetchAllLessonItems = async (
  api: ApiClient,
  maxLessonsPerPage: number,
) => {
  let allItems: LessonItem[] = [];
  const itemTypes = ["text_blocks", "files", "questions"];

  for (const itemType of itemTypes) {
    let page = 1;
    while (true) {
      const response = await api.resourceAction({
        resourceId: itemType,
        actionName: "list",
        params: {
          filters: { archived: false, state: "published" },
          page,
          perPage: maxLessonsPerPage,
        },
      });
      const items: LessonItem[] = response.data.records.map(
        (item: RecordJSON) => ({
          ...item,
          params: {
            ...item.params,
            title:
              itemType.slice(0, -1) === "question"
                ? item.params.question_body.slice(0, 77) + "..."
                : item.params.title.slice(0, 77) + "...",
            type: itemType.slice(0, -1) as "text_block" | "file" | "question",
          },
        }),
      );
      allItems = [...allItems, ...items];

      if (items.length < maxLessonsPerPage) {
        break;
      }

      page++;
    }
  }

  return allItems;
};
