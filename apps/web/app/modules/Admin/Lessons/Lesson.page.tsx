import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";

import { useDeleteFile } from "~/api/mutations/admin/useDeleteFile";
import { useUpdateLesson } from "~/api/mutations/admin/useUpdateLesson";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { lessonByIdQueryOptions, useLessonById } from "~/api/queries/admin/useLessonById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";

import { LessonDetails } from "./LessonDetails";
import LessonItemAssigner from "./LessonItemsAssigner/LessonItemAssigner";

import type { UpdateLessonBody } from "~/api/generated-api";

const displayedFields: Array<keyof UpdateLessonBody> = [
  "title",
  "description",
  "state",
  "imageUrl",
  "archived",
];

const Lesson = () => {
  const { id } = useParams();

  if (!id) throw new Error("Lesson ID not found");

  const [isUploading, setIsUploading] = useState(false);
  const { data: lesson, isLoading } = useLessonById(id);
  const { mutateAsync: updateLesson } = useUpdateLesson();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: deleteOldFile } = useDeleteFile();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<UpdateLessonBody>();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (!lesson) throw new Error("Lesson not found");

  const newImageUrl = getValues("imageUrl");
  const oldImageUrl = lesson["imageUrl"] ?? "";

  const oldImageExist = Boolean(oldImageUrl);
  const newImageExist = Boolean(newImageUrl);
  const imageUrlChanged = oldImageExist && newImageExist && newImageUrl !== oldImageUrl;

  const onSubmit = (data: UpdateLessonBody) => {
    updateLesson({ data, lessonId: id }).then(() => {
      queryClient.invalidateQueries(lessonByIdQueryOptions(id));

      if (imageUrlChanged) {
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
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">Lesson Information</h2>
          <Button type="submit" disabled={!isDirty} className="mr-2">
            Save
          </Button>
        </div>
        <div className="space-y-4 pt-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-2">
              <Label className="text-neutral-600 font-normal">{displayFieldName(field)}</Label>
              {field === "imageUrl" ? (
                <>
                  {(oldImageUrl || newImageUrl) && (
                    <img
                      src={newImageUrl ?? oldImageUrl}
                      alt="Lesson"
                      className="h-80 self-start object-contain py-2"
                    />
                  )}
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
                <LessonDetails name={field} control={control} lesson={lesson} />
              )}
            </div>
          ))}
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Items Assignment</h3>
        <LessonItemAssigner lessonId={id} />
      </div>
    </div>
  );
};

export default Lesson;
