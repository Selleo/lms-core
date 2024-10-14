import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateQuestionItem } from "~/api/mutations/admin/useCreateQuestionItem";
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
  questionType: z.enum(["single_choice", "multiple_choice", "open_answer"]),
  questionBody: z
    .string()
    .min(10, "Question body must be at least 10 characters."),
  state: z.enum(["draft", "published"]),
  authorId: z.string().uuid("Invalid author ID."),
  solutionExplanation: z.string().optional(),
  questionAnswers: z
    .array(
      z.object({
        optionText: z.string().min(1, "Option text is required"),
        isStudentAnswer: z.boolean(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateNewQuestion = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { mutateAsync: createQuestion } = useCreateQuestionItem();
  const { data: currentUser } = useCurrentUserSuspense();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionType: "single_choice",
      questionBody: "",
      state: "draft",
      authorId: currentUser.id,
      solutionExplanation: "",
      questionAnswers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questionAnswers",
  });

  const questionType = form.watch("questionType");

  const onSubmit = (values: FormValues) => {
    createQuestion({ data: values }).then(() => {
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries(allLessonItemsQueryOptions());
    });
  };

  const renderAnswerOptions = () => {
    if (questionType === "open_answer") {
      return null;
    }

    return (
      <div className="space-y-4">
        {!isEmpty(fields) && <Label>Answer Options</Label>}
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={`questionAnswers.${index}.optionText`}
              control={form.control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter answer option" />
              )}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({
              optionText: "",
              isStudentAnswer: false,
            })
          }
        >
          Add Option
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new question. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="questionType">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single_choice">
                        Single Choice
                      </SelectItem>
                      <SelectItem value="multiple_choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="open_answer">Open Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="questionBody"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="questionBody">Question Body</Label>
                  <FormControl>
                    <Textarea id="questionBody" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderAnswerOptions()}
            <FormField
              control={form.control}
              name="solutionExplanation"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="solutionExplanation">
                    Solution Explanation (Optional)
                  </Label>
                  <FormControl>
                    <Textarea id="solutionExplanation" {...field} />
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
              <Button type="submit">Create Question</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
