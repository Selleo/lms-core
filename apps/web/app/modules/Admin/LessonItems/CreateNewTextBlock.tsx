import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateTextBlockItem } from "~/api/mutations/admin/useCreateTextBlockItem";
import { useCurrentUserSuspense } from "~/api/queries";
import { allLessonItemsQueryOptions } from "~/api/queries/admin/useAllLessonItems";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  body: z.string().min(10, "Body must be at least 10 characters."),
  state: z.enum(["draft", "published"], {
    required_error: "Please select a state.",
  }),
  authorId: z.string().uuid("Invalid author ID."),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateNewTextBlock = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { mutateAsync: createTextBlock } = useCreateTextBlockItem();
  const { data: currentUser } = useCurrentUserSuspense();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      state: "draft",
      authorId: currentUser.id,
    },
  });

  const onSubmit = (data: FormValues) => {
    createTextBlock({ data }).then(() => {
      onOpenChange(false);
      queryClient.invalidateQueries(allLessonItemsQueryOptions());
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Text Block</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new text block. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
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
                    <Textarea id="body" {...field} />
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
      </DialogContent>
    </Dialog>
  );
};
