import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateLesson } from "~/api/mutations/admin/useCreateLesson";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { allLessonsQueryOptions } from "~/api/queries/admin/useAllLessons";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z.object({
  type: z.enum(["multimedia", "quiz"]),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  state: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL"),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateNewLesson = () => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: uploadFile } = useUploadFile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "multimedia",
      title: "",
      description: "",
      state: "draft",
      imageUrl: "",
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadFile({ file, resource: "lesson" });
      form.setValue("imageUrl", result.fileUrl, { shouldValidate: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    createLesson({
      data: values,
    }).then(() => {
      setOpen(false);
      queryClient.invalidateQueries(allLessonsQueryOptions);
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Lesson</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new lesson. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="state" className="text-right">
                    Type
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select lesson type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="multimedia">Multimedia</SelectItem>
                      <SelectItem value="quiz">Test</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input id="description" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select a lesson state" />
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
                    Lesson Image
                  </Label>
                  <FormControl>
                    <div className="flex items-center flex-col gap-y-2">
                      <Input
                        id="imageUrl"
                        {...field}
                        readOnly
                        placeholder="Image URL will appear here after upload"
                        className="w-full"
                      />
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
            <DialogFooter>
              <Button type="submit" disabled={!isFormValid || isUploading}>
                Create Lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
