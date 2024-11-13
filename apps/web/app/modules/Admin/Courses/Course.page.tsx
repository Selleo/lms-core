import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";

import { useDeleteFile } from "~/api/mutations/admin/useDeleteFile";
import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { courseQueryOptions, useCourseById } from "~/api/queries/admin/useCourseById";
import { categoriesQueryOptions, useCategoriesSuspense } from "~/api/queries/useCategories";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { CourseDetails } from "./CourseDetails";
import LessonAssigner from "./LessonAssigner/LessonAssigner";

import type { UpdateCourseBody } from "~/api/generated-api";

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
  "imageUrl",
  "archived",
];

const Course = () => {
  const { id } = useParams();

  if (!id) throw new Error("Course ID not found");

  const [isUploading, setIsUploading] = useState(false);
  const { data: course, isLoading } = useCourseById(id);
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const { data: categories } = useCategoriesSuspense();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteOldFile } = useDeleteFile();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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

  const newImageUrl = getValues("imageUrl");
  const oldImageUrl = course["imageUrl"];

  const onSubmit = async (data: UpdateCourseBody) => {
    updateCourse({
      data: { ...data, priceInCents: Number(data.priceInCents) },
      courseId: id,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(id));
      if (newImageUrl && newImageUrl !== oldImageUrl) {
        deleteOldFile(oldImageUrl);
      }
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadFile({ file, resource: "lesson" });
      setValue("imageUrl", result.fileUrl, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const displayFieldName = (field: string) =>
    match(field)
      .with("archived", () => "Status")
      .with("imageUrl", () => "Image")
      .otherwise(() => startCase(field));

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
              <Label htmlFor={field}>{displayFieldName(field)}</Label>
              {field === "imageUrl" ? (
                <>
                  <img
                    src={newImageUrl ?? oldImageUrl}
                    alt="Lesson"
                    className="h-80 self-start object-contain py-2"
                  />
                  <Input id={field} hidden readOnly className="hidden" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    disabled={isUploading}
                    className="w-full"
                  />
                </>
              ) : (
                <CourseDetails
                  name={field}
                  control={control}
                  categories={categories}
                  course={course}
                />
              )}
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
