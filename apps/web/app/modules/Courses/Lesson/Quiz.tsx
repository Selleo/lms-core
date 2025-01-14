import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useSubmitQuiz } from "~/api/mutations";
import { queryClient } from "~/api/queryClient";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

import { Questions } from "./Questions";
import { QuizFormSchema } from "./schemas";
import { getUserAnswers, parseQuizFormData } from "./utils";

import type { QuizForm } from "./types";
import type { GetLessonByIdResponse } from "~/api/generated-api";

type QuizProps = {
  lesson: GetLessonByIdResponse["data"];
};

export const Quiz = ({ lesson }: QuizProps) => {
  const { lessonId = "" } = useParams();
  const { t } = useTranslation();

  const questions = lesson.quizDetails?.questions;

  const methods = useForm<QuizForm>({
    mode: "onSubmit",
    // Temporary workaround
    defaultValues: getUserAnswers(questions ?? []) as QuizForm,
    resolver: zodResolver(QuizFormSchema(t)),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: () => queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] }),
  });

  if (!questions?.length) return null;

  const handleOnSubmit = async (data: QuizForm) => {
    submitQuiz.mutate({ lessonId, questionsAnswers: parseQuizFormData(data) });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col gap-y-4"
        onSubmit={methods.handleSubmit(handleOnSubmit, () => {
          toast({
            variant: "destructive",
            description: t("studentLessonView.validation.unansweredQuestions"),
          });
        })}
      >
        <Questions questions={questions} isQuizCompleted={lesson.quizCompleted} />
        <Button type="submit" className="flex gap-x-2 items-center self-end">
          <span>{t("studentLessonView.button.submit")}</span>
          <Icon name="ArrowRight" className="w-4 h-auto" />
        </Button>
      </form>
    </FormProvider>
  );
};
