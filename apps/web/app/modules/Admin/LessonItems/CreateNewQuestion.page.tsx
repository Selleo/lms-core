import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { useCreateQuestionItem } from "~/api/mutations/admin/useCreateQuestionItem";
import { useUpdateQuestionOptions } from "~/api/mutations/admin/useUpdateQuestionOptions";
import { useCurrentUserSuspense } from "~/api/queries";
import { ALL_LESSON_ITEMS_QUERY_KEY } from "~/api/queries/admin/useAllLessonItems";
import { queryClient } from "~/api/queryClient";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

const questionFormSchema = z.object({
  questionType: z.enum([
    "single_choice",
    "multiple_choice",
    "open_answer",
    "fill_in_the_blanks_text",
    "fill_in_the_blanks_dnd",
  ]),
  questionBody: z.string().min(10, "Question body must be at least 10 characters."),
  state: z.enum(["draft", "published"]),
  authorId: z.string().uuid("Invalid author ID."),
  solutionExplanation: z.string().optional(),
  options: z.array(
    z.object({
      value: z.string().min(1, "Option text is required"),
      isCorrect: z.boolean(),
      position: z.number(),
    }),
  ),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

export default function CreateNewQuestionPage() {
  const { mutateAsync: createQuestion } = useCreateQuestionItem();
  const { mutateAsync: assignAnswerOption } = useUpdateQuestionOptions();
  const { data: currentUser } = useCurrentUserSuspense();
  const navigate = useNavigate();
  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionType: "single_choice",
      questionBody: "",
      state: "draft",
      authorId: currentUser.id,
      solutionExplanation: "",
      options: [
        {
          value: "",
          isCorrect: false,
          position: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: questionForm.control,
    name: "options",
  });

  const onQuestionSubmit = async (values: QuestionFormValues) => {
    try {
      const response = await createQuestion({ data: values });
      const newQuestionId = response.data.questionId;

      if (newQuestionId) {
        const options = values.options.map((option, index) => ({
          questionId: newQuestionId,
          optionText: option.value,
          isCorrect: option.isCorrect,
          position: index,
        }));

        await assignAnswerOption({
          data: options,
          questionId: newQuestionId,
        });

        await queryClient.invalidateQueries({
          queryKey: ALL_LESSON_ITEMS_QUERY_KEY,
        });

        navigate(`/admin/lesson-items/${newQuestionId}`);
        questionForm.reset();
      }

      if (values.questionType === "open_answer") {
        queryClient.invalidateQueries({ queryKey: ALL_LESSON_ITEMS_QUERY_KEY });
      }
    } catch (error) {
      console.error("Error while creating question:", error);
    }
  };

  const renderQuestionForm = () => (
    <Form {...questionForm}>
      <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)} className="space-y-4">
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
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="open_answer">Open Answer</SelectItem>
                  <SelectItem value="fill_in_the_blanks_text">Fill in the blanks (text)</SelectItem>
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
                <Editor id="questionBody" content={field.value} className="h-32" {...field} />
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
              <Label htmlFor="solutionExplanation">Solution Explanation (Optional)</Label>
              <FormControl>
                <Editor
                  id="solutionExplanation"
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

        <Label className="space-y-4 flex flex-col">
          <span>Answer Options</span>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Controller
                name={`options.${index}.value`}
                control={questionForm.control}
                render={({ field }) => <Input {...field} placeholder="Enter answer option" />}
              />
              <Controller
                name={`options.${index}.isCorrect`}
                control={questionForm.control}
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
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="w-min"
            variant="outline"
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
        </Label>
        <div className="flex w-full justify-end">
          <Button type="submit" className="w-min">
            Create question
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <CreatePageHeader
        title="Create New Question"
        description="Fill in the details to create a new question. Click next when you're done."
      />
      {renderQuestionForm()}
    </div>
  );
}
