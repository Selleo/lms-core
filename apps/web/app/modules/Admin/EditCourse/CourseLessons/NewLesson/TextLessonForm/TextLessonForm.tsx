import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../../EditCourse.types";

import { useTextLessonForm } from "./hooks/useTextLessonForm";

import type { Chapter, LessonItem } from "../../../EditCourse.types";

type TextLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
  lessonToEdit?: LessonItem;
};

const TextLessonForm = ({
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
}: TextLessonProps) => {
  const { form, onSubmit, onClickDelete } = useTextLessonForm({
    chapterToEdit,
    lessonToEdit,
    setContentTypeToDisplay,
  });

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-grey-500 mb-2">Text</h1>
        {lessonToEdit && (
          <div className="text-xl font-semibold text-gray-800">
            Edit: {lessonToEdit?.content.title}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-end">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl className="flex items-center">
                      <Checkbox
                        id="state"
                        checked={field.value === "draft"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "draft" : "published")
                        }
                        className="mr-2 w-5 h-5"
                      />
                    </FormControl>
                    <Label htmlFor="state" className="text-right text-l leading-[1] mt-[2px]">
                      Draft
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              name="body"
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
                  onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
                  className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-[#3F58B6] hover:bg-blue-600 text-white">
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
