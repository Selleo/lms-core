import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateQuestionItem } from "~/api/mutations/admin/useCreateQuestionItem";
import { useUpdateQuestionOptions } from "~/api/mutations/admin/useUpdateQuestionOptions";
import { useCurrentUserSuspense } from "~/api/queries";
import { allLessonItemsQueryOptions } from "~/api/queries/admin/useAllLessonItems";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { useState } from "react";

const questionFormSchema = z.object({
  questionType: z.enum([
    "single_choice",
    "multiple_choice",
    "open_answer",
    "fill_in_the_blanks_text",
    "fill_in_the_blanks_dnd",
  ]),
  questionBody: z
    .string()
    .min(10, "Question body must be at least 10 characters."),
  state: z.enum(["draft", "published"]),
  authorId: z.string().uuid("Invalid author ID."),
  solutionExplanation: z.string().optional(),
});

const answerOptionsSchema = z.object({
  options: z.array(
    z.object({
      value: z.string().min(1, "Option text is required"),
      isCorrect: z.boolean(),
      position: z.number(),
    }),
  ),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;
type AnswerOptionsFormValues = z.infer<typeof answerOptionsSchema>;

export const CreateNewQuestion = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<"question" | "options">("question");
  const [createdQuestionId, setCreatedQuestionId] = useState<string | null>(
    null,
  );

  const { mutateAsync: createQuestion } = useCreateQuestionItem();
  const { mutateAsync: assignAnswerOption } = useUpdateQuestionOptions();
  const { data: currentUser } = useCurrentUserSuspense();

  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionType: "single_choice",
      questionBody: "",
      state: "draft",
      authorId: currentUser.id,
      solutionExplanation: "",
    },
  });

  const answerOptionsForm = useForm<AnswerOptionsFormValues>({
    resolver: zodResolver(answerOptionsSchema),
    defaultValues: {
      options: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: answerOptionsForm.control,
    name: "options",
  });

  const onQuestionSubmit = async (values: QuestionFormValues) => {
    try {
      const response = await createQuestion({ data: values });
      const newQuestionId = response.data.questionId;
      setCreatedQuestionId(newQuestionId);

      if (values.questionType === "open_answer") {
        onOpenChange(false);
        queryClient.invalidateQueries(allLessonItemsQueryOptions());
      } else {
        setStep("options");
      }
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const onOptionsSubmit = async (values: AnswerOptionsFormValues) => {
    try {
      if (!createdQuestionId) return;

      const options = values.options.map((option, index) => ({
        questionId: createdQuestionId,
        optionText: option.value,
        isCorrect: option.isCorrect,
        position: index,
      }));

      await assignAnswerOption({
        data: options,
        questionId: createdQuestionId,
      });

      onOpenChange(false);
      queryClient.invalidateQueries(allLessonItemsQueryOptions());
      setStep("question");
      questionForm.reset();
      answerOptionsForm.reset();
    } catch (error) {
      console.error("Error assigning answer options:", error);
    }
  };

  const renderAnswerOptionsForm = () => (
    <Form {...answerOptionsForm}>
      <form
        onSubmit={answerOptionsForm.handleSubmit(onOptionsSubmit)}
        className="space-y-4"
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Controller
                name={`options.${index}.value`}
                control={answerOptionsForm.control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter answer option" />
                )}
              />
              <Controller
                name={`options.${index}.isCorrect`}
                control={answerOptionsForm.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`isCorrect-${index}`}>Correct</Label>
                      <Checkbox
                        id={`isCorrect-${index}`}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                value: "",
                isCorrect: false,
                position: fields.length,
              })
            }
          >
            Add Option
          </Button>
        </div>
        <DialogFooter>
          <Button type="submit">Create Options</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  const renderQuestionForm = () => (
    <Form {...questionForm}>
      <form
        onSubmit={questionForm.handleSubmit(onQuestionSubmit)}
        className="space-y-4"
      >
        <FormField
          control={questionForm.control}
          name="questionType"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="questionType">Question Type</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="questionType">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single_choice">Single Choice</SelectItem>
                  <SelectItem value="multiple_choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="open_answer">Open Answer</SelectItem>
                  <SelectItem value="fill_in_the_blanks_text">
                    Fill in the blanks (text)
                  </SelectItem>
                  <SelectItem value="fill_in_the_blanks_dnd">
                    Fill in the blanks (drag & drop)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={questionForm.control}
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
        <FormField
          control={questionForm.control}
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
          control={questionForm.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="state">State</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Button type="submit">Next</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "question" ? "Create New Question" : "Add Answer Options"}
          </DialogTitle>
          <DialogDescription>
            {step === "question"
              ? "Fill in the details to create a new question. Click next when you're done."
              : "Add answer options for your question. Mark the correct answer(s)."}
          </DialogDescription>
        </DialogHeader>
        {step === "question" ? renderQuestionForm() : renderAnswerOptionsForm()}
      </DialogContent>
    </Dialog>
  );
};
