import { useCallback, useEffect, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import FileUploadInput from "~/components/FileUploadInput/FileUploadInput";
import { FormTextareaField } from "~/components/Form/FormTextareaFiled";
import { FormTextField } from "~/components/Form/FormTextField";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { getFileTypeFromName } from "~/utils/getFileTypeFromName";

import { ContentTypes } from "../../../EditCourse.types";

import { useFileLessonForm } from "./hooks/useFileLessonForm";

import type { Chapter, Lesson } from "../../../EditCourse.types";

type FileLessonProps = {
  contentTypeToDisplay: string;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
  lessonToEdit?: Lesson;
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
  const [url, setUrl] = useState(lessonToEdit?.fileS3Key || "");
  const fileType = form.watch("fileType");

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "lesson" });
        setUrl(result.fileUrl);
        form.setValue("fileS3Key", result.fileKey);
        const fileType = getFileTypeFromName(file.name);
        if (fileType) {
          form.setValue("fileType", fileType);
        }
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
    form.setValue("fileType", fileType);
  }, [contentTypeToDisplay, form]);

  return (
    <div className="flex flex-col gap-y-6 p-8 bg-white rounded-lg">
      <div className="flex flex-col gap-y-1">
        <h1 className="body-base-md text-neutral-800">
          {contentTypeToDisplay === ContentTypes.PRESENTATION_FORM ? "Presentation" : "Video"}
        </h1>
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
            label="Lesson Title"
            placeholder="Provide lesson title..."
            required
          />
          <FormItem>
            <Label htmlFor="file" className="body-base-md text-neutral-950">
              <span className="text-error-600">*</span>{" "}
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
            <FormMessage />
          </FormItem>
          <FormTextareaField
            label="Description"
            name="description"
            control={form.control}
            placeholder={`Provide description about the ${contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM ? "video" : "presentation"}...`}
          />
          <div className="flex gap-x-3">
            <Button type="submit" className="bg-primary-700 hover:bg-blue-600 text-white">
              Save
            </Button>
            <Button
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
    </div>
  );
};

export default FileLessonForm;
