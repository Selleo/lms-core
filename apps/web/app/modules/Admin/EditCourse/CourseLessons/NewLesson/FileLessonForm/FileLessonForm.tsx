import { useCallback, useEffect, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import FileUploadInput from "~/components/FileUploadInput/FileUploadInput";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormField, FormItem, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ContentTypes } from "../../../EditCourse.types";

import { useFileLessonForm } from "./hooks/useFileLessonForm";

import type { Chapter, LessonItem } from "../../../EditCourse.types";

type FileLessonProps = {
  contentTypeToDisplay: string;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
  lessonToEdit?: LessonItem;
};

const FileLessonForm = ({
  contentTypeToDisplay,
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
}: FileLessonProps) => {
  const { form, onSubmit, onClickDelete } = useFileLessonForm({
    chapterToEdit,
    lessonToEdit,
    setContentTypeToDisplay,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [url, setUrl] = useState(lessonToEdit?.content.url || "");

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "lessonItem" });
        setUrl(result.fileUrl);
        form.setValue("url", result.fileKey);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile, form],
  );

  useEffect(() => {
    form.setValue(
      "type",
      contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM ? "video" : "presentation",
    );
  }, [contentTypeToDisplay, form]);

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-grey-500 mb-2">
          {contentTypeToDisplay === ContentTypes.PRESENTATION_FORM ? "Presentation" : "Video"}
        </h1>
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
                    Lesson Title
                  </Label>
                  <FormControl>
                    <Input id="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <Label htmlFor="file">
                {" "}
                <span className="text-red-500">*</span>
                {contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM
                  ? "Upload video"
                  : "Upload presentation"}
              </Label>
              <FormControl>
                <FileUploadInput
                  handleFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  contentTypeToDisplay={contentTypeToDisplay}
                  url={url}
                />
              </FormControl>
              {isUploading && <p>Uploading...</p>}
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <Label htmlFor="body" className="text-right">
                    Description
                  </Label>
                  <FormControl>
                    <Editor id="body" content={field.value} className="h-32 w-full" {...field} />
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
              <Button type="submit" className="bg-primary-700 hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FileLessonForm;
