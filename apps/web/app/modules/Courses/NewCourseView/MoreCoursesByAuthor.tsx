import { isEmpty } from "lodash-es";

import { useUserById } from "~/api/queries/admin/useUserById";
import { useTeacherCourses } from "~/api/queries/useTeacherCourses";
import { Icon } from "~/components/Icon";
import Loader from "~/modules/common/Loader/Loader";
import { StudentCoursesCarousel } from "~/modules/Dashboard/Courses/StudentCoursesCarousel";

type MoreCoursesByAuthorProps = {
  teacherId: string;
};

export const MoreCoursesByAuthor = ({ teacherId }: MoreCoursesByAuthorProps) => {
  const { data: teacherCourses, isLoading } = useTeacherCourses(teacherId);
  const { data: teacherData } = useUserById(teacherId);

  return (
    <section className="flex flex-col gap-y-6 w-full h-full bg-white p-8 rounded-lg">
      <div className="flex flex-col">
        <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">
          More courses by {teacherData?.firstName} {teacherData?.lastName}
        </h4>
        <p className="text-lg leading-7 text-neutral-800">
          Below you can see more courses created by the same author
        </p>
      </div>
      <div
        data-testid="enrolled-courses"
        className="flex gap-6 lg:p-8 lg:bg-white w-full lg:rounded-lg drop-shadow-primary"
      >
        {!teacherCourses ||
          (isEmpty(teacherCourses) && (
            <div className="col-span-3 flex gap-8">
              <div>
                <Icon name="EmptyCourse" className="mr-2 text-neutral-900" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-lg font-bold leading-5 text-neutral-950">
                  We could not find any courses
                </p>
                <p className="text-neutral-800 text-base leading-6 font-normal">
                  Please change the search criteria or try again later
                </p>
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        )}
        <StudentCoursesCarousel studentCourses={teacherCourses} />
      </div>
    </section>
  );
};
