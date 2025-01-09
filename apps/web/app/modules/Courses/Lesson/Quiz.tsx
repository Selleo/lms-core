import { useParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";

import { useSubmitQuiz } from "~/api/mutations";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Questions } from "~/modules/Courses/Lesson/Questions";
import { getUserAnswers } from "~/modules/Courses/Lesson/utils";

import type { GetLessonByIdResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";
import { useTranslation } from "react-i18next";

type QuizProps = {
  lesson: GetLessonByIdResponse["data"];
};

function transformData(input: TQuestionsForm) {
  const result = [];

  for (const questionId in input.openQuestions) {
    result.push({
      questionId: questionId,
      answer: [
        {
          answerId: questionId,
          value: input.openQuestions[questionId],
        },
      ],
    });
  }

  for (const questionId in input.singleAnswerQuestions) {
    const answers = input.singleAnswerQuestions[questionId];
    const answerArray = [];
    for (const answerId in answers) {
      if (answers[answerId]) {
        answerArray.push({
          answerId: answerId,
        });
      }
    }
    if (answerArray.length > 0) {
      result.push({
        questionId: questionId,
        answer: answerArray,
      });
    }
  }

  for (const questionId in input.multiAnswerQuestions) {
    const answers = input.multiAnswerQuestions[questionId];
    const answerArray = [];
    for (const answerId in answers) {
      if (answers[answerId]) {
        answerArray.push({
          answerId: answerId,
        });
      }
    }
    if (answerArray.length > 0) {
      result.push({
        questionId: questionId,
        answer: answerArray,
      });
    }
  }

  return result;
}

export const Quiz = ({ lesson }: QuizProps) => {
  const { lessonId = "" } = useParams();
  const { t } = useTranslation();

  const questions = lesson.quizDetails?.questions;

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(questions ?? []),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: () => {
      // TODO: Add logic to handle success
    },
  });

  if (!questions?.length) return null;

  const handleOnSubmit = async (data: TQuestionsForm) => {
    // TODO: Quiz submit logic needs adjustment
    submitQuiz.mutate({ lessonId, answers: transformData(data) });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col gap-y-4"
        onSubmit={methods.handleSubmit(handleOnSubmit)}
      >
        <Questions questions={questions} />
        <Button type="submit" className="flex gap-x-2 items-center self-end">
          <span>{t("studentLessonView.button.submit")}</span>
          <Icon name="ArrowRight" className="w-4 h-auto" />
        </Button>
      </form>
    </FormProvider>
  );
};
