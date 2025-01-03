import { FormProvider, useForm } from "react-hook-form";

import { useSubmitQuiz } from "~/api/mutations";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Questions } from "~/modules/Courses/Lesson/Questions";
import { getUserAnswers } from "~/modules/Courses/Lesson/utils";

import type { GetLessonByIdResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type QuizProps = {
  lesson: GetLessonByIdResponse["data"];
};

export const Quiz = ({ lesson }: QuizProps) => {
  const questions = lesson.quizDetails?.questions;

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(questions),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: async () => {},
  });

  if (!questions?.length) return null;

  const handleOnSubmit = () => {
    // TODO: Add logic to submit quiz
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col gap-y-4"
        onSubmit={methods.handleSubmit(handleOnSubmit)}
      >
        <Questions questions={questions} />
        <Button type="submit" className="flex gap-x-2 items-center self-end">
          <span>Submit</span>
          <Icon name="ArrowRight" className="w-4 h-auto" />
        </Button>
      </form>
    </FormProvider>
  );
};
