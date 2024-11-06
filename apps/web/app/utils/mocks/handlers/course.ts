import { http, HttpResponse } from "msw";

import { availableCourses, studentCourses } from "../data/courses";
import { withSearchParams } from "../resolvers/withSearchParams";

const filterAndSortCourses = (searchParams: URLSearchParams) => {
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let filteredCourses = [...availableCourses.data];

  if (title) {
    filteredCourses = filteredCourses.filter((course) =>
      course.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  if (category) {
    filteredCourses = filteredCourses.filter((course) => course.category === category);
  }

  if (sort) {
    let field = sort;
    let order = "asc";

    if (sort.startsWith("-")) {
      field = sort.substring(1);
      order = "desc";
    }

    filteredCourses.sort((a, b) => {
      if (field === "title") {
        return order === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  return filteredCourses;
};

const availableCoursesHandler = withSearchParams(
  () => true,
  ({ request }) => {
    const url = new URL(request.url);
    const filteredCourses = filterAndSortCourses(url.searchParams);

    return HttpResponse.json({
      ...availableCourses,
      data: filteredCourses,
    });
  },
);

export const handlers = [
  http.get("/api/courses", availableCoursesHandler),
  http.get("/api/courses/available-courses", availableCoursesHandler),
  http.get("/api/courses/get-student-courses", () => {
    return HttpResponse.json(studentCourses);
  }),
];
