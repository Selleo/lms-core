import { useNavigate, useParams } from "@remix-run/react";
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

function transformData(input: TQuestionsForm) {
  const result = [];

  for (const questionId in input.detailedResponses) {
    result.push({
      questionId: questionId,
      answer: [
        {
          answerId: questionId,
          value: input.detailedResponses[questionId],
        },
      ],
    });
  }

  for (const questionId in input.briefResponses) {
    result.push({
      questionId: questionId,
      answer: [
        {
          answerId: questionId,
          value: input.briefResponses[questionId],
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

  for (const questionId in input.photoQuestionSingleChoice) {
    const answers = input.photoQuestionSingleChoice[questionId];
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

  for (const questionId in input.fillInTheBlanksText) {
    const answers = input.fillInTheBlanksText[questionId];
    const answerArray = [];

    for (const [key, value] of Object.entries(answers)) {
      if (answers[key]) {
        answerArray.push({
          value,
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

  for (const questionId in input.fillInTheBlanksDnd) {
    const answers = input.fillInTheBlanksDnd[questionId];
    const answerArray = [];

    for (const [key, value] of Object.entries(answers)) {
      if (answers[key]) {
        answerArray.push({
          answerId: key,
          value,
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

  for (const questionId in input.photoQuestionMultipleChoice) {
    const answers = input.photoQuestionMultipleChoice[questionId];
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

  for (const questionId in input.trueOrFalseQuestions) {
    const answers = input.trueOrFalseQuestions[questionId];
    const answerArray = [];

    for (const answerId in answers) {
      const value =
        answers[answerId] === "true" ? "true" : answers[answerId] === "false" ? "false" : null;
      if (value !== null) {
        answerArray.push({
          answerId: answerId,
          value: value,
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
  const { lessonId = "", courseId = "" } = useParams();
  const navigate = useNavigate();

  const questions = lesson.quizDetails?.questions;

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(questions ?? []),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: () => {
      navigate(`/course/${courseId}/lesson/${lesson.nextLessonId}`);
    },
  });

  if (!questions?.length) return null;

  const handleOnSubmit = async (data: TQuestionsForm) => {
    console.log({ data });
    submitQuiz.mutate({ lessonId, answers: transformData(data) });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col gap-y-4"
        onSubmit={methods.handleSubmit(handleOnSubmit)}
      >
        <Questions questions={questions} isQuizCompleted={lesson.quizCompleted} />
        <Button type="submit" className="flex gap-x-2 items-center self-end">
          <span>Submit</span>
          <Icon name="ArrowRight" className="w-4 h-auto" />
        </Button>
      </form>
    </FormProvider>
  );
};
