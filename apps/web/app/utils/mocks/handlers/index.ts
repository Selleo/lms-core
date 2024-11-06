import { http, HttpResponse } from "msw";

import { categories } from "../data/categories";

import { handlers as authHandlers } from "./auth";
import { handlers as courseHandlers } from "./course";

export const handlers = [
  http.get("/api/categories", () => {
    return HttpResponse.json(categories);
  }),
  ...courseHandlers,
  ...authHandlers,
];
