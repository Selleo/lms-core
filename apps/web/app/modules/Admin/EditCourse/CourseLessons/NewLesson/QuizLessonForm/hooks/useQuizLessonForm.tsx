import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { quizLessonFormSchema } from "../validators/quizLessonFormChemat";

import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";

export const useQuizLessonForm = () => {
  const form = useForm<QuizLessonFormValues>({
    resolver: zodResolver(quizLessonFormSchema),
    defaultValues: {
      title: "",
      state: "draft",
      questions: [
        {
          questionType: "single_choice",
          questionBody: "",
          state: "draft",
          options: [
            {
              value: "",
              isCorrect: false,
              position: 1,
            },
          ],
        },
      ],
    },
  });

  return { form };
};
