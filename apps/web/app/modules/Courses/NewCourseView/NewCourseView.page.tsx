import { useParams } from "@remix-run/react";

import { useCourse } from "~/api/queries";
import { PageWrapper } from "~/components/PageWrapper";
import { CourseChapter } from "~/modules/Courses/NewCourseView/CourseChapter";
import CourseOverview from "~/modules/Courses/NewCourseView/CourseOverview";
import { CourseViewSidebar } from "~/modules/Courses/NewCourseView/CourseViewSidebar/CourseViewSidebar";
import { MoreCoursesByAuthor } from "~/modules/Courses/NewCourseView/MoreCoursesByAuthor";
import { YouMayBeInterestedIn } from "~/modules/Courses/NewCourseView/YouMayBeInterestedIn";

export default function NewCourseViewPage() {
  const { id = "" } = useParams();
  const { data: course } = useCourse(id);

  if (!course) return null;

  // TODO: Add breadcrumbs
  // const breadcrumbs = [
  //   {
  //     title: "Dashboard",
  //     href: "/",
  //   },
  //   {
  //     title: course?.title ?? "",
  //     href: `/course/${id}`,
  //   },
  // ];

  return (
    <PageWrapper className="max-w-full">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] max-w-full gap-6 w-full">
        <div className="flex flex-col gap-y-6 overflow-hidden">
          <CourseOverview course={course} />
          <div className="py-6 px-4 md:p-8 rounded-lg bg-white flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <h4 className="h6 text-neutral-950">Chapters</h4>
              <p className="body-base-md text-neutral-800">
                Below you can see all chapters inside this course
              </p>
            </div>
            {course?.chapters?.map((chapter) => {
              if (!chapter) return null;

              return <CourseChapter chapter={chapter} key={chapter.id} />;
            })}
          </div>
          <MoreCoursesByAuthor courseId={course.id} teacherId={course.authorId} />
          <YouMayBeInterestedIn courseId={course.id} category={course.category} />
        </div>
        <CourseViewSidebar course={course} />
      </div>
    </PageWrapper>
  );
}
