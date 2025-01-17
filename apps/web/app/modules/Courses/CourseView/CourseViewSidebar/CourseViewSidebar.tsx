import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { useUserDetails } from "~/api/queries/useUserDetails";
import { Gravatar } from "~/components/Gravatar";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useUserRole } from "~/hooks/useUserRole";
import { CourseOptions } from "~/modules/Courses/CourseView/CourseViewSidebar/CourseOptions";
import { CourseProgress } from "~/modules/Courses/CourseView/CourseViewSidebar/CourseProgress";

import type { GetCourseResponse } from "~/api/generated-api";

type CourseViewSidebar = {
  course: GetCourseResponse["data"];
};

export const CourseViewSidebar = ({ course }: CourseViewSidebar) => {
  const { data: userDetails } = useUserDetails(course?.authorId ?? "");
  const { isAdmin, isTeacher } = useUserRole();
  const { t } = useTranslation();

  const shouldShowCourseOptions = !isAdmin && !isTeacher && !course?.enrolled;

  return (
    <section className="sticky left-0 top-6 flex h-min flex-col gap-y-6 rounded-b-lg rounded-t-2xl bg-white p-8 drop-shadow xl:w-full xl:max-w-[480px] 3xl:top-12">
      {shouldShowCourseOptions ? (
        <CourseOptions course={course} />
      ) : (
        <CourseProgress course={course} />
      )}
      <h4 className="h6 pb-1 pt-2 text-neutral-950">
        {t("studentCourseView.sideSection.other.author")}
      </h4>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <Avatar className="h-20 w-20">
          <Gravatar email={userDetails?.contactEmail || ""} />
        </Avatar>
        <div className="flex flex-col">
          <h2 className="h6 text-neutral-950">
            {userDetails?.firstName} {userDetails?.lastName}
          </h2>
          <div className="flex flex-col gap-y-1">
            <p className="body-sm">
              <span className="text-neutral-900">
                {t("studentCourseView.sideSection.other.title")}:
              </span>{" "}
              <span className="font-medium text-neutral-950">{userDetails?.jobTitle}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-3">
          <span className="text-neutral-900">{t("studentCourseView.sideSection.other.about")}</span>
          <div className="h-[1px] w-full bg-primary-200" />
        </div>
        <p className="body-sm mt-2 text-neutral-950">{userDetails?.description}</p>
      </div>
      <Button variant="outline" className="sr-only">
        <span>{t("studentCourseView.sideSection.other.collapse")}</span>
      </Button>
      <Button variant="outline">
        <Link to={`/teachers/${course?.authorId}`}>
          <span>{t("studentCourseView.sideSection.button.goToTeacherPage")}</span>
        </Link>
      </Button>
    </section>
  );
};
