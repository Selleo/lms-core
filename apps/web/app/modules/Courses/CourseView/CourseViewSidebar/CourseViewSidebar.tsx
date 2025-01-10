import { Link } from "@remix-run/react";

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

  const shouldShowCourseOptions = !isAdmin && !isTeacher && !course?.enrolled;

  return (
    <section className="flex sticky top-6 3xl:top-12 left-0 flex-col h-min xl:w-full xl:max-w-[480px] gap-y-6 p-8 bg-white rounded-t-2xl rounded-b-lg drop-shadow">
      {shouldShowCourseOptions ? (
        <CourseOptions course={course} />
      ) : (
        <CourseProgress course={course} />
      )}
      <h4 className="h6 text-neutral-950 pb-1 pt-2">Author</h4>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="w-20 h-20">
          <Gravatar email={userDetails?.contactEmail || ""} />
        </Avatar>
        <div className="flex flex-col">
          <h2 className="h6 text-neutral-950">
            {userDetails?.firstName} {userDetails?.lastName}
          </h2>
          <div className="flex flex-col gap-y-1">
            <p className="body-sm">
              <span className="text-neutral-900">Title:</span>{" "}
              <span className="font-medium text-neutral-950">{userDetails?.jobTitle}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-3 items-center">
          <span className="text-neutral-900">About</span>
          <div className="bg-primary-200 h-[1px] w-full" />
        </div>
        <p className="body-sm mt-2 text-neutral-950">{userDetails?.description}</p>
      </div>
      <Button variant="outline" className="sr-only">
        <span>Collapse</span>
      </Button>
      <Button variant="outline">
        <Link to={`/teachers/${course?.authorId}`}>
          <span>Go to teacher page</span>
        </Link>
      </Button>
    </section>
  );
};
