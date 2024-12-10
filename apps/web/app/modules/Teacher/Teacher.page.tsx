import { useParams } from "@remix-run/react";

import { useTeacherCourses } from "~/api/queries/useTeacherCourses";
import { useUserDetails } from "~/api/queries/useUserDetails";
import { ButtonGroup } from "~/components/ButtonGroup/ButtonGroup";
import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import CourseCard from "~/modules/Dashboard/Courses/CourseCard";

import { TeacherPageBreadcrumbs } from "./TeacherPageBreadcrumbs";

export default function TeacherPage() {
  const { id = "" } = useParams();
  const { data: userDetails } = useUserDetails(id);
  const { data: teacherCourses } = useTeacherCourses(id);

  return (
    <PageWrapper>
      <TeacherPageBreadcrumbs
        id={id}
        username={`${userDetails?.firstName} ${userDetails?.lastName}`}
      />
      <div className="flex flex-col xl:flex-row gap-6">
        <section className="flex flex-col xl:w-full xl:max-w-[480px] gap-y-6 p-6 bg-white rounded-t-2xl rounded-b-lg drop-shadow">
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
            <p className="body-base mt-2 text-neutral-950">{userDetails?.description}</p>
          </div>
          <div className="flex xl:mt-auto flex-col gap-y-1 md:gap-y-4">
            <div className="flex gap-x-3 items-center">
              <span className="text-neutral-900">Contact</span>
              <div className="bg-primary-200 h-[1px] w-full" />
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:*:w-full">
              <a
                href={`tel:${userDetails?.contactPhone}`}
                className="bg-primary-50 inline-flex gap-x-2 rounded-lg py-2 px-3 body-base-md text-primary-700"
              >
                <Icon name="Phone" className="w-6 h-6 text-neutral-900" />
                <span>{userDetails?.contactPhone}</span>
              </a>
              <a
                href={`mailto:${userDetails?.contactEmail}`}
                className="bg-primary-50 inline-flex gap-x-2 rounded-lg py-2 px-3 body-base-md text-primary-700"
              >
                <Icon name="Email" className="w-6 h-6 text-neutral-900" />
                <span>{userDetails?.contactEmail}</span>
              </a>
            </div>
          </div>
          <Button variant="outline" className="sr-only">
            Collapse
          </Button>
        </section>
        <section className="flex flex-col gap-y-6 p-6 bg-white rounded-t-2xl rounded-b-lg drop-shadow">
          <div className="flex flex-col gap-y-2">
            <h2 className="h5">Courses</h2>
            <ButtonGroup
              className="!w-full !max-w-none flex *:w-full md:!w-min"
              buttons={[
                {
                  children: "Courses",
                  isActive: true,
                },
                {
                  children: "Reviews",
                  isActive: false,
                  onClick: (e) => e.preventDefault(),
                },
              ]}
            />
            {/*TODO: Add filters*/}
          </div>
          <div className="flex flex-wrap lg:overflow-y-scroll lg:max-h-[calc(100dvh-260px)] gap-6 xl:gap-4 *:max-w-[250px]">
            {teacherCourses?.map((course) => <CourseCard key={course.id} {...course} />)}
          </div>
          <Button variant="outline" className="sr-only">
            Show more
          </Button>
        </section>
      </div>
    </PageWrapper>
  );
}
