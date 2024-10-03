import { http, HttpResponse } from "msw";
import { courses } from "../data/courses";

export const handlers = [
  http.get("/api/courses", () => {
    return HttpResponse.json(courses);
  }),
];
