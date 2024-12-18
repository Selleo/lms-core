import { Link, useParams } from "@remix-run/react";

import { useCourse } from "~/api/queries";
import { useUserDetails } from "~/api/queries/useUserDetails";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useUserRole } from "~/hooks/useUserRole";
import { CourseChapter } from "~/modules/Courses/NewCourseView/CourseChapter";
import CourseOverview from "~/modules/Courses/NewCourseView/CourseOverview";
import { MoreCoursesByAuthor } from "~/modules/Courses/NewCourseView/MoreCoursesByAuthor";
import { YouMayBeInterestedIn } from "~/modules/Courses/NewCourseView/YouMayBeInterestedIn";
import { PaymentModal } from "~/modules/stripe/PaymentModal";

export default function NewCourseViewPage() {
  const { id = "" } = useParams();
  const { data: course } = useCourse(id);
  const { data: userDetails } = useUserDetails(course?.authorId ?? "");
  const { isAdmin } = useUserRole();

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
          <div className="p-8 rounded-lg bg-white flex flex-col gap-y-6">
            <div className="flex flex-col">
              <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">Chapters</h4>
              <p className="text-lg leading-7 text-neutral-800">
                Below you can see all chapters inside this course
              </p>
            </div>
            {course?.chapters?.map((chapter) => {
              if (!chapter) return null;

              return <CourseChapter chapter={chapter} key={chapter.id} />;
            })}
          </div>
          <MoreCoursesByAuthor teacherId={course.authorId} />
          <YouMayBeInterestedIn category={course.category} />
        </div>
        <section className="flex flex-col xl:w-full xl:max-w-[480px] gap-y-6 p-6 bg-white rounded-t-2xl rounded-b-lg drop-shadow">
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">Options</h4>
          <div className="flex flex-col gap-y-2">
            <Button variant="outline" className="gap-x-2" disabled>
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.54001 10.81L15.46 7.85M9.54001 13.19L15.46 16.15M9.05286 10.1141C10.0944 11.1556 10.0944 12.8443 9.05286 13.8858C8.01133 14.9273 6.32268 14.9273 5.28115 13.8858C4.23962 12.8443 4.23962 11.1556 5.28115 10.1141C6.32268 9.07257 8.01133 9.07257 9.05286 10.1141ZM19.7189 4.78115C20.7604 5.82268 20.7604 7.51133 19.7189 8.55286C18.6774 9.59439 16.9887 9.59439 15.9472 8.55286C14.9057 7.51133 14.9057 5.82268 15.9472 4.78115C16.9887 3.73962 18.6774 3.73962 19.7189 4.78115ZM19.7189 15.4471C20.7604 16.4886 20.7604 18.1773 19.7189 19.2188C18.6774 20.2603 16.9887 20.2603 15.9472 19.2188C14.9057 18.1773 14.9057 16.4886 15.9472 15.4471C16.9887 14.4056 18.6774 14.4056 19.7189 15.4471Z"
                  stroke="#384995"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Share this course</span>
            </Button>
            {!isAdmin && !course?.enrolled && course && Boolean(course?.priceInCents) && (
              <PaymentModal
                courseCurrency={course.currency}
                coursePrice={course.priceInCents}
                courseTitle={course.title}
                courseId={course.id}
              />
            )}
          </div>
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1 pt-2">Author</h4>
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
          <Button variant="outline" className="sr-only">
            <span>Collapse</span>
          </Button>
          <Button variant="outline">
            <Link to={`/teachers/${course?.authorId}`}>
              <span>Go to teacher page</span>
            </Link>
          </Button>
        </section>
      </div>
    </PageWrapper>
  );
}
