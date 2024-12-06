import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import QuestionSelector from "./components/QuestionSelector";
import { useQuizLessonForm } from "./hooks/useQuizLessonForm";

const QuizLessonForm = () => {
  const { form } = useQuizLessonForm();
  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-grey-500 mb-2">Quiz</h1>
        <Form {...form}>
          <form>
            <div className="flex items-center justify-end">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl className="flex items-center">
                      <Checkbox
                        id="state"
                        checked={field.value === "draft"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "draft" : "published")
                        }
                        className="mr-2 w-5 h-5"
                      />
                    </FormControl>
                    <Label htmlFor="state" className="text-right text-l leading-[1] mt-[2px]">
                      Draft
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <QuestionSelector />
            <div className="flex space-x-4 mt-4">
              <Button
                //   onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
                className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#3F58B6] hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default QuizLessonForm;
