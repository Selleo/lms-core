import { http, HttpResponse } from "msw";
import { handlers as courseHandlers } from "./course";
import { handlers as authHandlers } from "./auth";
import { categories } from "../data/categories";

export const handlers = [
  http.get("/api/categories", () => {
    return HttpResponse.json(categories);
  }),
  ...courseHandlers,
  ...authHandlers,
];
