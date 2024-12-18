import { FormTextField } from "~/components/Form/FormTextField";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Label } from "~/components/ui/label";

import { ContentTypes, DeleteContentType } from "../../../EditCourse.types";

import { useTextLessonForm } from "./hooks/useTextLessonForm";

import type { Chapter, Lesson } from "../../../EditCourse.types";
import { useState } from "react";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";

type TextLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
  lessonToEdit?: Lesson;
};

const TextLessonForm = ({
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
}: TextLessonProps) => {
  const { form, onSubmit, onDelete } = useTextLessonForm({
    chapterToEdit,
    lessonToEdit,
    setContentTypeToDisplay,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-y-6 p-8 bg-white rounded-lg">
      <div className="flex flex-col gap-y-1">
        <h1 className="body-base-md text-neutral-800">Text</h1>
        <div className="h5 text-neutral-950">
          {lessonToEdit ? (
            <>
              <span className="text-neutral-600">Edit:</span> {lessonToEdit?.title}
            </>
          ) : (
            "Create"
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
          <FormTextField
            control={form.control}
            name="title"
            label="Title"
            placeholder="Provide lesson title..."
            required
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="description" className="body-base-md text-neutral-950">
                  <span className="text-red-500">*</span> Description
                </Label>
                <FormControl>
                  <Editor
                    id="description"
                    content={field.value}
                    className="h-32 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-3">
            <Button type="submit" className="bg-primary-700 hover:bg-blue-600 text-white">
              Save
            </Button>
            <Button
              type="button"
              onClick={
                lessonToEdit ? onClickDelete : () => setContentTypeToDisplay(ContentTypes.EMPTY)
              }
              className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
            >
              {lessonToEdit ? "Delete" : "Cancel"}
            </Button>
          </div>
        </form>
      </Form>
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={onCloseModal}
        onDelete={onDelete}
        contentType={DeleteContentType.TEXT_BLOCK}
      />
    </div>
  );
};

export default TextLessonForm;
