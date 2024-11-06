import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useForm } from "react-hook-form";

import type { UpdateCourseBody } from "~/api/generated-api";
import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { courseQueryOptions, useCourseById } from "~/api/queries/admin/useCourseById";
import { categoriesQueryOptions, useCategoriesSuspense } from "~/api/queries/useCategories";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { CourseDetails } from "./CourseDetails";
import LessonAssigner from "./LessonAssigner/LessonAssigner";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(categoriesQueryOptions());
  return null;
};

const displayedFields: Array<keyof UpdateCourseBody> = [
  "title",
  "description",
  "state",
  "priceInCents",
  "currency",
  "categoryId",
  "archived",
];

const Course = () => {
  const { id } = useParams();

  if (!id) throw new Error("Course ID not found");

  const { data: course, isLoading } = useCourseById(id);
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const { data: categories } = useCategoriesSuspense();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateCourseBody>();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!course) throw new Error("Course not found");

  const onSubmit = async (data: UpdateCourseBody) => {
    updateCourse({
      data: { ...data, priceInCents: Number(data.priceInCents) },
      courseId: id,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(id));
    });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="h1">Course Information</h2>
          <Button type="submit" disabled={!isDirty} className="mr-2">
            Save
          </Button>
        </div>
        <div className="space-y-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-1">
              <Label htmlFor={field}>{field === "archived" ? "Status" : startCase(field)}</Label>
              <CourseDetails
                name={field}
                control={control}
                categories={categories}
                course={course}
              />
            </div>
          ))}
        </div>
      </form>
      <div className="mt-8">
        <h3 className="h2 text-gray-900 my-4">Lesson Assignment</h3>
        <LessonAssigner courseId={id} />
      </div>
    </div>
  );
};

export default Course;
