import { useParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCategoriesSuspense } from "~/api/queries/useCategories";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { Icon } from "~/components/Icon";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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

import CourseCardPreview from "../compontents/CourseCardPreview";

import { useCourseSettingsForm } from "./hooks/useCourseSettingsForm";

type CourseSettingsProps = {
  title?: string;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
};
const CourseSettings = ({ title, description, categoryId, imageUrl }: CourseSettingsProps) => {
  const { id } = useParams();
  const courseId = id ?? "";
  const { form, onSubmit } = useCourseSettingsForm({
    title,
    description,
    categoryId,
    imageUrl,
    courseId,
  });
  const { data: categories } = useCategoriesSuspense();
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const isFormValid = form.formState.isValid;

  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");
  const watchedImageUrl = form.watch("imageUrl");

  const categoryName = useMemo(() => {
    return categories.find((category) => category.id === form.getValues("categoryId"))?.title;
  }, [categories, form.getValues("categoryId")]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "course" });
        form.setValue("imageUrl", result.fileUrl, { shouldValidate: true });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [form],
  );

  return (
    <div className="w-full flex gap-4 ">
      <Card className="p-4 shadow-md border border-gray-200 w-7/10 flex-grow">
        <CardHeader>
          <h5 className="text-xl font-semibold">Basic settings</h5>
        </CardHeader>
        <CardContent>
          <p>Fill in the details to create a new course.</p>
          <Form {...form}>
            <form className="mt-[2.5rem]" onSubmit={form.handleSubmit(onSubmit)}>
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
                      <span className="text-red-500 mr-1">*</span>
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

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1 mt-5">
                    <Label htmlFor="categoryId" className="text-right">
                      <span className="text-red-500 mr-1">*</span>
                      Category
                    </Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="categoryId">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <Label htmlFor="imageUrl" className="text-right">
                      Thumbnail
                    </Label>
                    <FormControl>
                      <ImageUploadInput
                        field={field}
                        handleImageUpload={handleImageUpload}
                        isUploading={isUploading}
                        imageUrl={imageUrl}
                      />
                    </FormControl>

                    {isUploading && <p>Uploading image...</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-auto mx-auto">
                {watchedImageUrl && (
                  <Button
                    onClick={() => form.setValue("imageUrl", "")}
                    className="bg-red-500 text-white py-2 px-6 rounded mb-4 mt-4"
                  >
                    <Icon name="TrashIcon" className="mr-2" />
                    Remove Thumbnail
                  </Button>
                )}
                <div className="flex space-x-5 mt-5">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isUploading}
                    className="bg-blue-500 text-white py-2 px-6 mt-5 rounded"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <CourseCardPreview
        imageUrl={watchedImageUrl}
        title={watchedTitle}
        description={watchedDescription}
        category={categoryName}
      />
    </div>
  );
};

export default CourseSettings;
