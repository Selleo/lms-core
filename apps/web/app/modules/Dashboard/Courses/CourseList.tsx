import { match } from "ts-pattern";

import { type GetAllCoursesResponse } from "~/api/generated-api";
import { type CourseListLayout } from "~/types/shared";

import { CardCourseList } from "./CardCourseList";
import { TableCourseList } from "./TableCourseList";

export const CourseList: React.FC<{
  availableCourses: GetAllCoursesResponse["data"];
  courseListLayout: CourseListLayout;
}> = ({ availableCourses, courseListLayout }) =>
  match(courseListLayout)
    .with("card", () => <CardCourseList availableCourses={availableCourses} />)
    .with("table", () => <TableCourseList availableCourses={availableCourses} />)
    .exhaustive();
