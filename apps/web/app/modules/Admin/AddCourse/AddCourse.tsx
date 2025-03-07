import { useNavigate } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCategoriesSuspense } from "~/api/queries/useCategories";
import SplashScreenImage from "~/assets/svgs/splash-screen-image.svg";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { FormTextareaField } from "~/components/Form/FormTextareaFiled";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import Breadcrumb from "./components/Breadcrumb";
import { useAddCourseForm } from "./hooks/useAddCourseForm";

const AddCourse = () => {
  const { form, onSubmit } = useAddCourseForm();
  const { data: categories } = useCategoriesSuspense();
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const { isValid: isFormValid } = form.formState;
  const maxDescriptionFieldLength = 800;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [displayThumbnailUrl, setDisplayThumbnailUrl] = useState<string | undefined>(undefined);

  const watchedDescriptionLength = form.watch("description").length;
  const descriptionFieldCharactersLeft = maxDescriptionFieldLength - watchedDescriptionLength;

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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen overflow-auto bg-white px-20 py-8">
      <div className="flex w-full items-center justify-center">
        <img src={SplashScreenImage} alt="splashScreenImage" className="rounded" />
      </div>
      <div className="flex w-full max-w-[820px] flex-col gap-y-6 px-8">
        <Breadcrumb />
        <hgroup className="gapy-y-1 flex flex-col">
          <h1 className="h3 text-neutral-950">{t("adminCourseView.settings.header")}</h1>
          <p className="body-lg-md text-neutral-800">{t("adminCourseView.settings.subHeader")}</p>
        </hgroup>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex space-x-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="title" className="body-base-md">
                      <span className="text-red-500">*</span>{" "}
                      {t("adminCourseView.settings.field.title")}
                    </Label>
                    <FormControl>
                      <Input
                        id="title"
                        {...field}
                        required
                        placeholder={t("adminCourseView.settings.placeholder.title")}
                        className="placeholder:body-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="categoryId">
                      <span className="text-red-500">*</span>{" "}
                      {t("adminCourseView.settings.field.category")}
                    </Label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id="categoryId"
                            className="data-[placeholder]:body-base rounded-lg border border-neutral-300 focus:border-primary-800 focus:ring-primary-800"
                          >
                            <SelectValue
                              placeholder={t("adminCourseView.settings.placeholder.category")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.id}
                              key={category.id}
                              data-testid={`category-option-${category.title}`}
                            >
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <Label htmlFor="description">
                    <span className="text-red-500">*</span>{" "}
                    {t("adminCourseView.settings.field.description")}
                  </Label>
                  <FormControl>
                    <FormTextareaField
                      control={form.control}
                      id="description"
                      maxLength={maxDescriptionFieldLength}
                      placeholder={t("adminCourseView.settings.placeholder.description")}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {descriptionFieldCharactersLeft <= 0 ? (
              <p className="text-sm text-red-500">
                {t("adminCourseView.settings.other.reachedCharactersLimit")}
              </p>
            ) : (
              <p className="mt-1 text-neutral-800">
                {descriptionFieldCharactersLeft}{" "}
                {t("adminCourseView.settings.other.charactersLeft")}
              </p>
            )}

            <FormField
              control={form.control}
              name="thumbnailS3Key"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <Label htmlFor="fileUrl">{t("adminCourseView.settings.field.thumbnail")}</Label>
                  <FormControl>
                    <ImageUploadInput
                      field={field}
                      handleImageUpload={handleImageUpload}
                      isUploading={isUploading}
                      imageUrl={displayThumbnailUrl}
                      fileInputRef={fileInputRef}
                    />
                  </FormControl>

                  {isUploading && <p>{t("common.other.uploadingImage")}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            {displayThumbnailUrl && (
              <Button
                name="thumbnail"
                onClick={removeThumbnail}
                className="mb-4 mt-4 rounded bg-red-500 px-6 py-2 text-white"
              >
                <Icon name="TrashIcon" className="mr-2" />
                {t("adminCourseView.settings.button.removeThumbnail")}
              </Button>
            )}

            <div className="pb-5">
              <div className="mb-10 mt-5 flex space-x-5">
                <Button
                  type="button"
                  className="rounded border-2 bg-white px-6 py-2 text-primary-800"
                  onClick={() => navigate("/admin/courses")}
                >
                  {t("common.button.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="rounded bg-primary-700 px-6 py-2 text-white"
                  disabled={!isFormValid || isUploading}
                >
                  {t("common.button.proceed")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCourse;
