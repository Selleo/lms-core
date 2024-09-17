import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  coursesQueryOptions,
  useCoursesSuspense,
} from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export const clientLoader = async () => {
  await queryClient.prefetchQuery(coursesQueryOptions);
  return null;
};

export default function DashboardPage() {
  const { data: courses } = useCoursesSuspense();

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex flex-col">
        <h1 className="h3 text-neutral-950">Available Courses</h1>
        <p className="text-body-lg text-neutral-700">Available Courses</p>
      </div>
      <div className="grid p-6 gap-y-12 grid-cols-[repeat(auto-fit,minmax(360px,1fr))] bg-white">
        {courses.map(({ title, category, courseLessonCount, id }, index) => (
          <Link key={index} to={`/course/${id}`}>
            <div className="flex flex-col gap-y-2.5 max-w-[360px] border border-primary-200 rounded-lg">
              <img
                src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
                alt=""
                className="rounded-md"
              />
              <h3 className="h6 text-neutral-950 truncate px-4">{title}</h3>
              <div className="flex justify-between p-4">
                <div className="flex flex-col text-details justify-end text-neutral-500">
                  <span>{category}</span>
                  <span>{courseLessonCount} lessons</span>
                </div>
                <Button>Enroll</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
