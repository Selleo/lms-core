import type { Lesson } from "./types.js";
import { ApiClient } from "adminjs";

export const fetchAllLessons = async (
  api: ApiClient,
  maxLessonsPerPage: number,
) => {
  let allLessons: Lesson[] = [];
  let page = 1;

  while (true) {
    const response = await api.resourceAction({
      resourceId: "lessons",
      actionName: "list",
      params: {
        filters: { archived: false },
        page,
        perPage: maxLessonsPerPage,
        sort: "title",
      },
    });

    const lessons: Lesson[] = response.data.records;
    allLessons = [...allLessons, ...lessons];

    if (lessons.length < maxLessonsPerPage) {
      break;
    }

    page++;
  }

  return allLessons;
};
