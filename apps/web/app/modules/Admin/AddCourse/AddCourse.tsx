import { useNavigate } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCategoriesSuspense } from "~/api/queries/useCategories";
import SplashScreenImage from "~/assets/svgs/splash-screen-image.svg";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
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
    <div className="flex h-screen bg-white px-20 py-8 overflow-auto">
      <div className="w-full flex items-center justify-center">
        <img src={SplashScreenImage} alt="splashScreenImage" className="rounded" />
      </div>
      <div className="w-full max-w-[820px] flex flex-col gap-y-6 px-8">
        <Breadcrumb />
        <hgroup className="flex flex-col gapy-y-1">
          <h1 className="h3 text-neutral-950">Create new course</h1>
          <p className="body-lg-md text-neutral-800">
            Provide the details to set up a new course. You’ll have more options to customize it
            later.
          </p>
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
                      <span className="text-red-500">*</span> Course title
                    </Label>
                    <FormControl>
                      <Input
                        id="title"
                        {...field}
                        required
                        placeholder="Enter title..."
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
                      <span className="text-red-500">*</span> Category
                    </Label>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id="categoryId"
                            className="border border-neutral-300 focus:border-primary-800 focus:ring-primary-800 rounded-lg data-[placeholder]:body-base"
                          >
                            <SelectValue placeholder="Select category" />
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
                    <span className="text-red-500">*</span> Description
                  </Label>
                  <FormControl>
                    <textarea
                      id="description"
                      maxLength={maxDescriptionFieldLength}
                      placeholder="Provide description about the course..."
                      className="h-32 px-2 py-1 text-left text-neutral-950 body-base placeholder:body-base  placeholder:text-neutral-600 border border-neutral-300 rounded-lg focus:border-blue-500 focus:border-2 focus:outline-none"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                <FormItem className="mt-5">
                  <Label htmlFor="fileUrl">Thumbnail</Label>
                  <FormControl>
                    <ImageUploadInput
                      field={field}
                      handleImageUpload={handleImageUpload}
                      isUploading={isUploading}
                      imageUrl={displayThumbnailUrl}
                      fileInputRef={fileInputRef}
                    />
                  </FormControl>

                  {isUploading && <p>Uploading image...</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            {displayThumbnailUrl && (
              <Button
                onClick={removeThumbnail}
                className="bg-red-500 text-white py-2 px-6 rounded mb-4 mt-4"
              >
                <Icon name="TrashIcon" className="mr-2" />
                Remove Thumbnail
              </Button>
            )}

            <div className="pb-5">
              <div className="flex space-x-5 mt-5 mb-10">
                <Button
                  type="button"
                  className="bg-white text-primary-800 border-2 rounded px-6 py-2"
                  onClick={() => navigate("/admin/courses")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-700 text-white rounded px-6 py-2"
                  disabled={!isFormValid || isUploading}
                >
                  Proceed
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
