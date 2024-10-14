import {
  coursesQueryOptions,
  useCoursesSuspense,
} from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(coursesQueryOptions());
  return null;
};

const Courses = () => {
  const { data } = useCoursesSuspense();
  console.log(data);
  return <div>Courses</div>;
};

export default Courses;
