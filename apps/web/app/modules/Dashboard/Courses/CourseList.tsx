import { match } from "ts-pattern";
import { GetAllCoursesResponse } from "~/api/generated-api";
import { CardCourseList } from "./CardCourseList";
import { TableCourseList } from "./TableCourseList";
import { CourseListLayout } from "~/types/shared";

export const CourseList: React.FC<{
  availableCourses: GetAllCoursesResponse["data"];
  courseListLayout: CourseListLayout;
}> = ({ availableCourses, courseListLayout }) =>
  match(courseListLayout)
    .with("card", () => <CardCourseList availableCourses={availableCourses} />)
    .with("table", () => (
      <TableCourseList availableCourses={availableCourses} />
    ))
    .exhaustive();
