import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateTextBlockItem } from "~/api/mutations/admin/useCreateTextBlockItem";
import { useCurrentUserSuspense } from "~/api/queries";
import { ALL_LESSON_ITEMS_QUERY_KEY } from "~/api/queries/admin/useAllLessonItems";
import { queryClient } from "~/api/queryClient";
import Editor from "~/components/RichText/Editor";
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
  title: z.string().min(2, "Title must be at least 2 characters."),
  body: z.string().min(10, "Body must be at least 10 characters."),
  state: z.enum(["draft", "published"], {
    required_error: "Please select a state.",
  }),
  authorId: z.string().uuid("Invalid author ID."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewTextBlockPage() {
  const { mutateAsync: createTextBlock } = useCreateTextBlockItem();
  const { data: currentUser } = useCurrentUserSuspense();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      state: "draft",
      authorId: currentUser.id,
    },
  });

  const onSubmit = async (data: FormValues) => {
    createTextBlock({ data }).then(({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ALL_LESSON_ITEMS_QUERY_KEY,
      });

      navigate(`/admin/lesson-items/${data.id}`);
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="flex flex-col gap-y-6">
      <CreatePageHeader
        title="Create New Text Block"
        description="Fill in the details to create a new text block. Click save when
          you're done."
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
            name="body"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="body">Body</Label>
                <FormControl>
                  <Editor
                    id="body"
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
            <Button type="submit" disabled={!isFormValid}>
              Create Text Block
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
