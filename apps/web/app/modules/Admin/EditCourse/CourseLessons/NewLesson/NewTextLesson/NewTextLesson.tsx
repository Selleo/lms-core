import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../../EditCourse.types";

import { useNewTextLessonForm } from "./hooks/useNewTextLessonForm";

import type { Chapter } from "../../../EditCourse.types";

type NewTextLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
};

const NewTextLesson = ({ setContentTypeToDisplay, chapterToEdit }: NewTextLessonProps) => {
  const { form, onSubmit } = useNewTextLessonForm({ chapterToEdit });
  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-xl font-semibold mb-6 text-gray-800">Chapter</div>
        <Form {...form}>
          <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
              <Button
                className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
                onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewTextLesson;
