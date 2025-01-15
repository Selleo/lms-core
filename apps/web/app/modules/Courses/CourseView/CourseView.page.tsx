import { useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { useCourse } from "~/api/queries";
import { PageWrapper } from "~/components/PageWrapper";
import { CourseChapter } from "~/modules/Courses/CourseView/CourseChapter";
import CourseOverview from "~/modules/Courses/CourseView/CourseOverview";
import { CourseViewSidebar } from "~/modules/Courses/CourseView/CourseViewSidebar/CourseViewSidebar";
import { MoreCoursesByAuthor } from "~/modules/Courses/CourseView/MoreCoursesByAuthor";
import { YouMayBeInterestedIn } from "~/modules/Courses/CourseView/YouMayBeInterestedIn";

export default function CourseViewPage() {
  const { t } = useTranslation();
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
      <div className="flex w-full max-w-full flex-col gap-6 lg:grid lg:grid-cols-[1fr_480px]">
        <div className="flex flex-col gap-y-6 overflow-hidden">
          <CourseOverview course={course} />
          <div className="flex flex-col gap-y-4 rounded-lg bg-white px-4 py-6 md:p-8">
            <div className="flex flex-col gap-y-1">
              <h4 className="h6 text-neutral-950">{t("studentCourseView.header")}</h4>
              <p className="body-base-md text-neutral-800">{t("studentCourseView.subHeader")}</p>
            </div>
            {course?.chapters?.map((chapter) => {
              if (!chapter) return null;

              return (
                <CourseChapter chapter={chapter} key={chapter.id} enrolled={course.enrolled} />
              );
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
