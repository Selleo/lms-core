import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateCourseBody } from "~/api/generated-api";
import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import {
  courseQueryOptions,
  useCourseById,
} from "~/api/queries/admin/useCourseById";
import {
  categoriesQueryOptions,
  useCategoriesSuspense,
} from "~/api/queries/useCategories";
import { queryClient } from "~/api/queryClient";
import LessonAssigner from "./LessonAssigner/LessonAssigner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { CourseInfo } from "./CourseInfo";

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
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Course ID not found");

  const { data: course, isLoading } = useCourseById(id);
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const { data: categories } = useCategoriesSuspense();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateCourseBody>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (!course) throw new Error("Course not found");

  const onSubmit = (data: UpdateCourseBody) => {
    updateCourse({
      data: { ...data, priceInCents: Number(data.priceInCents) },
      courseId: id,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(id));
      setIsEditing(false);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Course Information
          </h2>
          {isEditing ? (
            <div>
              <Button type="submit" disabled={!isDirty} className="mr-2">
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
        <div className="space-y-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-1">
              <Label htmlFor={field}>
                {field === "archived" ? "Status" : startCase(field)}
              </Label>
              <CourseInfo
                name={field}
                control={control}
                isEditing={isEditing}
                categories={categories}
                course={course}
              />
            </div>
          ))}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Lesson Assignment
        </h3>
        <LessonAssigner courseId={id} />
      </div>
    </div>
  );
};

export default Course;
