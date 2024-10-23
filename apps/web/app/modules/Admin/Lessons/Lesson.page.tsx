import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateLessonBody } from "~/api/generated-api";
import { useUpdateLesson } from "~/api/mutations/admin/useUpdateLesson";
import {
  lessonByIdQueryOptions,
  useLessonById,
} from "~/api/queries/admin/useLessonById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";
import LessonItemAssigner from "./LessonItemsAssigner/LessonItemAssigner";
import { LessonInfo } from "./LessonInfo";

const displayedFields: Array<keyof UpdateLessonBody> = [
  "title",
  "description",
  "state",
  "archived",
];

const Lesson = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Lesson ID not found");

  const { data: lesson, isLoading } = useLessonById(id);
  const { mutateAsync: updateLesson } = useUpdateLesson();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateLessonBody>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  if (!lesson) throw new Error("Lesson not found");

  const onSubmit = (data: UpdateLessonBody) => {
    updateLesson({ data, lessonId: id }).then(() => {
      queryClient.invalidateQueries(lessonByIdQueryOptions(id));
      setIsEditing(false);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg h-full p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">
            Lesson Information
          </h2>
          {isEditing ? (
            <div>
              <Button type="submit" disabled={!isDirty} className="mr-2">
                Save
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        <div className="space-y-4 pt-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-2">
              <Label className="text-neutral-600 font-normal">
                {field === "archived" ? "Status" : startCase(field)}
              </Label>
              <LessonInfo
                name={field}
                control={control}
                isEditing={isEditing}
                lesson={lesson}
              />
            </div>
          ))}
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Lesson Items Assignment
        </h3>
        <LessonItemAssigner lessonId={id} />
      </div>
    </div>
  );
};

export default Lesson;
