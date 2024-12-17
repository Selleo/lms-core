import { useParams } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../EditCourse.types";

import { useNewChapterForm } from "./hooks/useNewChapterForm";

import type { Chapter } from "../../EditCourse.types";
import { useState } from "react";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";
import { DeleteContentType } from "../CourseLessons.types";

type NewChapterProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapter?: Chapter;
};

const NewChapter = ({ setContentTypeToDisplay, chapter }: NewChapterProps) => {
  const { id: courseId } = useParams<{ id: string }>();
  if (!courseId) {
    throw new Error("courseId is required");
  }

  const { form, onSubmit, onDelete } = useNewChapterForm({
    courseId: courseId ?? "",
    chapter,
    setContentTypeToDisplay,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = () => {
    setIsModalOpen(true);
  };

  const buttonStyles = "bg-transparent text-red-500 border border-red-500 hover:bg-red-100";
  const saveButtonStyles = "bg-primary-700 hover:bg-blue-600 text-white";

  return (
    <div className="w-full h-min p-8 flex flex-col bg-white rounded-lg gap-y-6">
      <hgroup className="flex flex-col-reverse w-full gap-y-1">
        {chapter && (
          <h3 className="h5 text-neutral-950">
            <span className="text-neutral-800 h5">Edit: </span>
            {chapter.title}
          </h3>
        )}
        <p className="body-base-md text-neutral-800">Chapter</p>
      </hgroup>
      <Form {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="title" className="body-base-md text-neutral-950">
                  <span className="text-error-600">*</span> Title
                </Label>
                <FormControl>
                  <Input id="title" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4 mt-4">
            <Button type="submit" className={saveButtonStyles}>
              Save
            </Button>
            {chapter ? (
              <Button
                aria-label="Delete chapter"
                type="button"
                className={buttonStyles}
                onClick={onClickDelete}
              >
                Delete
              </Button>
            ) : (
              <Button
                aria-label="Cancel editing"
                className={buttonStyles}
                onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={onCloseModal}
        onDelete={onDelete}
        contentType={DeleteContentType.Chapter}
      />
    </div>
  );
};

export default NewChapter;
