import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCreateCourse } from "~/api/mutations/useCreateCourse";
import { categoriesQueryOptions, useCategoriesSuspense } from "~/api/queries/useCategories";
import { ALL_COURSES_QUERY_KEY } from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";
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
import { CreatePageHeader } from "~/modules/Admin/components";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(categoriesQueryOptions());
  return null;
};

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  state: z.enum(["draft", "published"], {
    required_error: "Please select a state.",
  }),
  priceInCents: z.string(),
  currency: z.string().optional().default("usd"),
  categoryId: z.string().min(1, "Category is required"),
  lessons: z.array(z.string()).optional(),
  imageUrl: z.union([z.string().url("Invalid image URL"), z.string().length(0)]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewScormCourse() {
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: createCourse } = useCreateCourse();
  const { data: categories } = useCategoriesSuspense();
  const { mutateAsync: uploadFile } = useUploadFile();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      state: "draft",
      priceInCents: "0",
      currency: "usd",
      categoryId: "",
      lessons: [],
      imageUrl: "",
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadFile({ file, resource: "course" });
      form.setValue("imageUrl", result.fileUrl, { shouldValidate: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    createCourse({
      data: { ...values, priceInCents: Number(values.priceInCents) },
    }).then(({ data }) => {
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_QUERY_KEY });
      navigate(`/admin/courses/${data.id}`);
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="flex flex-col gap-y-6">
      <CreatePageHeader
        title="Create new course"
        description="Fill in the details to create a new course. Click save when
            you're done."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <FormControl>
                  <Input id="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="description" className="text-right">
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
              <FormItem>
                <Label htmlFor="categoryId" className="text-right">
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
            name="priceInCents"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="priceInCents" className="text-right">
                  Price
                </Label>
                <FormControl>
                  <Input id="priceInCents" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <FormControl>
                  <Input id="currency" {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select a course state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
              <FormItem>
                <Label htmlFor="imageUrl" className="text-right">
                  Lesson Image (optional)
                </Label>
                <FormControl>
                  <div className="flex items-center flex-col gap-y-2">
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Lesson"
                        className="h-80 self-start object-contain py-2"
                      />
                    )}
                    <Input id="imageUrl" {...field} hidden readOnly className="hidden" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      disabled={isUploading}
                      className="w-full"
                    />
                  </div>
                </FormControl>
                {isUploading && <p>Uploading image...</p>}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isFormValid || isUploading}>
            Create Course
          </Button>
        </form>
      </Form>
    </div>
  );
}
