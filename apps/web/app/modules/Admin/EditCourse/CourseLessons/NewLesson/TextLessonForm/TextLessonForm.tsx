import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../../EditCourse.types";

import { useTextLessonForm } from "./hooks/useTextLessonForm";

import type { Chapter, Lesson } from "../../../EditCourse.types";

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
  const { form, onSubmit, onClickDelete } = useTextLessonForm({
    setContentTypeToDisplay,
    chapterToEdit,
    lessonToEdit,
  });

  const lessonType = "text_block";

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-grey-500 mb-2">Text</h1>
        {lessonToEdit && (
          <div className="text-xl font-semibold text-gray-800">Edit: {lessonToEdit?.title}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="title" className="text-right">
                    <span className="text-red-500 mr-1">*</span>
                    Title
                  </Label>
                  <FormControl>
                    <Input id="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <Label htmlFor="description" className="text-right">
                    <span className="text-red-500">*</span>
                    Description
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
            {/* TODO: refactor this */}
            <input type="hidden" {...form.register("chapterId")} value={chapterToEdit?.id} />
            <input type="hidden" {...(form.register("type"), { value: lessonType })} />
            <div className="flex space-x-4 mt-4">
              {lessonToEdit ? (
                <Button
                  className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
                  onClick={onClickDelete}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
                  className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-primary-700hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TextLessonForm;
