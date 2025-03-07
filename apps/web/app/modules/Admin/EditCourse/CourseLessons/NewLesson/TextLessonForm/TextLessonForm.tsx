import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FormTextField } from "~/components/Form/FormTextField";
import { Icon } from "~/components/Icon";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";

import { ContentTypes, DeleteContentType } from "../../../EditCourse.types";
import Breadcrumb from "../components/Breadcrumb";

import { useTextLessonForm } from "./hooks/useTextLessonForm";

import type { Chapter, Lesson } from "../../../EditCourse.types";

type TextLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit: Chapter | null;
  lessonToEdit: Lesson | null;
  setSelectedLesson: (selectedLesson: Lesson | null) => void;
};

const TextLessonForm = ({
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
  setSelectedLesson,
}: TextLessonProps) => {
  const { form, onSubmit, onDelete } = useTextLessonForm({
    chapterToEdit,
    lessonToEdit,
    setContentTypeToDisplay,
  });
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = () => {
    setIsModalOpen(true);
  };

  const maxDescriptionFieldLength = 3000;

  const watchedContentLength = form.watch("description").length;
  const descriptionFieldCharactersLeft = Math.max(
    0,
    maxDescriptionFieldLength - watchedContentLength,
  );

  return (
    <div className="flex flex-col gap-y-6 rounded-lg bg-white p-8">
      <div className="flex flex-col gap-y-1">
        {!lessonToEdit && (
          <Breadcrumb
            lessonLabel="Text"
            setContentTypeToDisplay={setContentTypeToDisplay}
            setSelectedLesson={setSelectedLesson}
          />
        )}
        <div className="h5 text-neutral-950">
          {lessonToEdit ? (
            <>
              <span className="text-neutral-600">
                {t("adminCourseView.curriculum.other.edit")}:{" "}
              </span>
              <span className="font-bold">{lessonToEdit.title}</span>
            </>
          ) : (
            t("common.button.create")
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex items-center">
            <span className="mr-1 text-red-500">*</span>
            <Label htmlFor="title" className="mr-2">
              {t("adminCourseView.curriculum.lesson.field.title")}
            </Label>
          </div>
          <FormTextField
            control={form.control}
            name="title"
            placeholder={t("adminCourseView.curriculum.lesson.placeholder.title")}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="description" className="body-base-md mt-6 text-neutral-950">
                  <span className="text-red-500">*</span>{" "}
                  {t("adminCourseView.curriculum.lesson.field.description")}
                </Label>
                <FormControl>
                  <Editor
                    id="description"
                    content={field.value}
                    className="h-32 w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <p className="mt-1 text-neutral-800">
            {descriptionFieldCharactersLeft} {t("adminCourseView.settings.other.charactersLeft")}
          </p>

          {form.formState.errors.description && (
            <p className="details-md flex items-center gap-x-1.5 text-error-600">
              <Icon name="Warning" />
              {form.formState.errors.description.message}
            </p>
          )}
          <div className="flex gap-x-3">
            <Button type="submit" className="mt-6 bg-primary-700 text-white hover:bg-blue-600">
              {t("adminCourseView.curriculum.lesson.button.saveLesson")}
            </Button>
            <Button
              type="button"
              onClick={
                lessonToEdit ? onClickDelete : () => setContentTypeToDisplay(ContentTypes.EMPTY)
              }
              className="mt-6 border border-red-500 bg-transparent text-red-500 hover:bg-red-100"
            >
              {lessonToEdit ? t("common.button.delete") : t("common.button.cancel")}
            </Button>
          </div>
        </form>
      </Form>
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={onCloseModal}
        onDelete={onDelete}
        contentType={DeleteContentType.TEXT}
      />
    </div>
  );
};

export default TextLessonForm;
