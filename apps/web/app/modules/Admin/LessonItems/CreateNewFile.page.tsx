import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize, startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateFileItem } from "~/api/mutations/admin/useCreateFileItem";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useCurrentUserSuspense } from "~/api/queries";
import { ALL_LESSON_ITEMS_QUERY_KEY } from "~/api/queries/admin/useAllLessonItems";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
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
import { CreatePageHeader } from "~/modules/Admin/components";
import { useNavigate } from "@remix-run/react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum([
    "presentation",
    "external_presentation",
    "video",
    "external_video",
  ]),
  url: z.string().url("Invalid URL"),
  state: z.enum(["draft", "published"]),
  authorId: z.string().uuid("Invalid author ID"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewFilePage() {
  const { mutateAsync: createFile } = useCreateFileItem();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { data: currentUser } = useCurrentUserSuspense();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "presentation",
      url: "",
      state: "draft",
      authorId: currentUser.id,
    },
  });

  const fileType = form.watch("type");

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadFile({ file, resource: "lessonItem" }).then((result) => {
        form.setValue("url", result.fileUrl);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await createFile({ data: values });
      navigate(`/admin/lesson-items/${data.id}`);
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: ALL_LESSON_ITEMS_QUERY_KEY,
      });
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const renderFileInput = () => {
    if (fileType === "presentation" || fileType === "video") {
      const acceptedTypes =
        fileType === "presentation" ? ".pptx,.ppt,.odp" : ".mp4,.avi,.mov";

      return (
        <FormItem>
          <Label htmlFor="file">File</Label>
          <FormControl>
            <Input
              id="file"
              type="file"
              accept={acceptedTypes}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleFileUpload(file);
                }
              }}
              disabled={isUploading}
            />
          </FormControl>
          {isUploading && <p>Uploading...</p>}
          <FormMessage />
        </FormItem>
      );
    }
    return null;
  };

  const renderUrlInput = () => {
    return (
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="url">URL</Label>
            <FormControl>
              <Input
                id="url"
                {...field}
                readOnly={fileType === "presentation" || fileType === "video"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CreatePageHeader
        title="Create New File"
        description="Fill in the details to create a new file. Click save when you're done."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="title">Title</Label>
                <FormControl>
                  <Input id="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="type">File Type</Label>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("url", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select a file type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      "presentation",
                      "external_presentation",
                      "video",
                      "external_video",
                    ].map((type) => (
                      <SelectItem value={type} key={type}>
                        {capitalize(startCase(type))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {renderFileInput()}
          {renderUrlInput()}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="state">State</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select a state" />
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
          <DialogFooter>
            <Button type="submit" disabled={isUploading}>
              Create File
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
