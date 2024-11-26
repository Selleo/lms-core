import { useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCategoriesSuspense } from "~/api/queries/useCategories";
import SplashScreenImage from "~/assets/svgs/splash-screen-image.svg";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { Icon } from "~/components/Icon";
import Editor from "~/components/RichText/Editor";
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

import { useAddCourseForm } from "./hooks/useAddCourseForm";

const AddCourse = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useAddCourseForm();
  const { data: categories } = useCategoriesSuspense();
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const { isValid: isFormValid } = form.formState;
  const watchedImageUrl = form.watch("imageUrl");
  const imageUrl = form.getValues("imageUrl");

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
    <div className="flex h-screen bg-white">
      <div className="w-1/2 flex items-center justify-center">
        <img src={SplashScreenImage} alt="splashScreenImage" className="rounded" />
      </div>
      <div className="w-1/2 mt-4">
        <Button
          onClick={() => navigate("/admin/courses")}
          className="border-2 border-beige-500 bg-white text-blue-500 py-2 px-6 rounded"
        >
          <Icon name="ChevronLeft" className="w-3 h-3 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mt-8">Create new course</h1>
        <h1 className="mt-5">
          Provide the details to set up a new course. You’ll have more options to customize it
          later.
        </h1>
        <Form {...form}>
          <form className="mt-10" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex space-x-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="title" className="text-right">
                      <span className="text-red-500">*</span>
                      Course title
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="categoryId" className="text-right">
                      <span className="text-red-500">*</span>
                      Category
                    </Label>
                    <FormControl>
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
            {watchedImageUrl && (
              <Button
                onClick={() => form.setValue("imageUrl", "")}
                className="bg-red-500 text-white py-2 px-6 rounded mb-4 mt-4"
              >
                <Icon name="TrashIcon" className="mr-2" />
                Remove Thumbnail
              </Button>
            )}

            <div className="pb-5">
              <div className="flex space-x-5 mt-5 mb-10">
                <Button className="bg-white text-blue-500 border-2 rounded px-6 py-2">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white rounded px-6 py-2"
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
