import { useParams } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../EditCourse.types";

import { useNewChapterForm } from "./hooks/useNewChapterForm";

import type { Chapter } from "../../EditCourse.types";

type NewChapterProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapter?: Chapter;
};

const NewChapter = ({ setContentTypeToDisplay, chapter }: NewChapterProps) => {
  const { id: courseId } = useParams();
  const { form, onSubmit, onClickDelete } = useNewChapterForm({
    courseId,
    chapter,
    setContentTypeToDisplay,
  });

  const buttonStyles = "bg-transparent text-red-500 border border-red-500 hover:bg-red-100";
  const saveButtonStyles = "bg-[#3F58B6] hover:bg-blue-600 text-white";

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-xl font-semibold mb-6 text-gray-800">Chapter</div>
        <div className="text-xl font-semibold mb-6 text-gray-800">
          {chapter && (
            <>
              <span className="text-gray-500">Edit: </span>
              {chapter.title}
            </>
          )}
        </div>
        <Form {...form}>
          <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="title" className="text-right">
                    <span className="text-red-500 mr-1">*</span> Title
                  </Label>
                  <FormControl>
                    <Input id="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4 mt-4">
              {chapter ? (
                <Button
                  aria-label="Delete chapter"
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
              <Button type="submit" className={saveButtonStyles}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewChapter;
