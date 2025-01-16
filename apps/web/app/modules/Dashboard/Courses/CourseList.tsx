import { match } from "ts-pattern";

import { TableCourseList } from "~/modules/Courses/components/TableCourseList";

import { CardCourseList } from "./CardCourseList";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";
import type { CourseListLayout } from "~/types/shared";

export const CourseList: React.FC<{
  availableCourses: GetAvailableCoursesResponse["data"];
  courseListLayout: CourseListLayout;
}> = ({ availableCourses, courseListLayout }) =>
  match(courseListLayout)
    .with("card", () => <CardCourseList availableCourses={availableCourses} />)
    .with("table", () => <TableCourseList availableCourses={availableCourses} />)
    .exhaustive();
