import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCategoriesSuspense } from "~/api/queries/useCategories";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { FormTextareaField } from "~/components/Form/FormTextareaFiled";
import { FormTextField } from "~/components/Form/FormTextField";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import CourseCardPreview from "../compontents/CourseCardPreview";

import { useCourseSettingsForm } from "./hooks/useCourseSettingsForm";

type CourseSettingsProps = {
  courseId?: string;
  title?: string;
  description?: string;
  categoryId?: string;
  thumbnailS3SingedUrl?: string;
  thumbnailS3Key?: string;
};
const CourseSettings = ({
  courseId,
  title,
  description,
  categoryId,
  thumbnailS3SingedUrl,
  thumbnailS3Key,
}: CourseSettingsProps) => {
  const { form, onSubmit } = useCourseSettingsForm({
    title,
    description,
    categoryId,
    thumbnailS3Key,
    courseId: courseId || "",
  });
  const { data: categories } = useCategoriesSuspense();
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const isFormValid = form.formState.isValid;
  const [displayThumbnailUrl, setDisplayThumbnailUrl] = useState<string | undefined>(
    thumbnailS3SingedUrl || undefined,
  );

  const { t } = useTranslation();
  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");
  const watchedCategoryId = form.getValues("categoryId");
  const maxDescriptionFieldLength = 800;

  const watchedDescriptionLength = watchedDescription.length;
  const descriptionFieldCharactersLeft = maxDescriptionFieldLength - watchedDescriptionLength;

  const categoryName = useMemo(() => {
    return categories.find((category) => category.id === watchedCategoryId)?.title;
  }, [categories, watchedCategoryId]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "course" });
        form.setValue("thumbnailS3Key", result.fileKey, { shouldValidate: true });
        setDisplayThumbnailUrl(result.fileUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [form, uploadFile],
  );

  const removeThumbnail = () => {
    form.setValue("thumbnailS3Key", "");
    setDisplayThumbnailUrl(undefined);
  };

  return (
    <div className="w-full flex h-full gap-x-6">
      <div className="w-full basis-full">
        <div className="p-8 shadow-md border overflow-y-auto bg-white h-full flex flex-col gap-y-6 rounded-lg border-gray-200 w-full">
          <div className="flex flex-col gap-y-1">
            <h5 className="text-neutral-950 h5">{t("adminCourseView.settings.editHeader")}</h5>
            <p className="body-lg-md text-neutral-800">
              {t("adminCourseView.settings.editSubHeader")}
            </p>
          </div>
          <Form {...form}>
            <form className="flex flex-col gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-x-6 *:w-full">
                <FormTextField
                  control={form.control}
                  name="title"
                  required
                  label={t("adminCourseView.settings.field.title")}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-y-1.5">
                      <Label htmlFor="categoryId">
                        <span className="text-error-600 mr-1">*</span>
                        {t("adminCourseView.settings.field.category")}
                      </Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="categoryId">
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem value={category.id} key={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormTextareaField
                control={form.control}
                name="description"
                label={t("adminCourseView.settings.field.description")}
                required
                maxLength={maxDescriptionFieldLength}
              />
              {descriptionFieldCharactersLeft <= 0 ? (
                <p className="text-red-500 text-sm">You have reached the character limit.</p>
              ) : (
                <p className="text-neutral-800 mt-1">
                  {descriptionFieldCharactersLeft} characters left
                </p>
              )}
              <FormField
                control={form.control}
                name="thumbnailS3Key"
                render={({ field }) => (
                  <FormItem className="max-h-[440px]">
                    <Label htmlFor="thumbnailS3Key">
                      {t("adminCourseView.settings.field.thumbnail")}
                    </Label>
                    <FormControl>
                      <ImageUploadInput
                        field={field}
                        handleImageUpload={handleImageUpload}
                        isUploading={isUploading}
                        imageUrl={displayThumbnailUrl}
                      />
                    </FormControl>
                    {isUploading && <p>{t("common.other.uploadingImage")}</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-start gap-x-2">
                {displayThumbnailUrl && (
                  <Button onClick={removeThumbnail} className="bg-red-500 text-white py-2 px-6">
                    <Icon name="TrashIcon" className="mr-2" />
                    {t("adminCourseView.settings.button.removeThumbnail")}
                  </Button>
                )}
              </div>
              <div className="flex space-x-5">
                <Button type="submit" disabled={!isFormValid || isUploading}>
                  {t("common.button.save")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="max-w-[480px] w-full">
        <CourseCardPreview
          imageUrl={displayThumbnailUrl}
          title={watchedTitle}
          description={watchedDescription}
          category={categoryName}
        />
      </div>
    </div>
  );
};

export default CourseSettings;
