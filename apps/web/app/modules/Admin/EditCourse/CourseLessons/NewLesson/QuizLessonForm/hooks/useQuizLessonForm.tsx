import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { quizLessonFormSchema } from "../validators/quizLessonFormSchema";

import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import { useCreateQuizLesson } from "~/api/mutations/admin/useCreateQuizLesson";
import { queryClient } from "~/api/queryClient";
import {
  Chapter,
  ContentTypes,
  Lesson,
  LessonType,
} from "~/modules/Admin/EditCourse/EditCourse.types";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { Question, QuestionOption, QuestionType } from "../QuizLessonForm.types";
import { useUpdateQuizLesson } from "~/api/mutations/admin/useUpdateQuizLesson";
import { useDeleteLesson } from "~/api/mutations/admin/useDeleteLesson";

type QuizLessonFormProps = {
  chapterToEdit?: Chapter;
  lessonToEdit?: Lesson;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

export const useQuizLessonForm = ({
  chapterToEdit,
  lessonToEdit,
  setContentTypeToDisplay,
}: QuizLessonFormProps) => {
  const { mutateAsync: createQuizLesson } = useCreateQuizLesson();
  const { mutateAsync: updateQuizLesson } = useUpdateQuizLesson();
  const { mutateAsync: deleteLesson } = useDeleteLesson();
  const { id: courseId } = useParams();
  const form = useForm<QuizLessonFormValues>({
    resolver: zodResolver(quizLessonFormSchema),
    defaultValues: {
      title: "",
      questions: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (lessonToEdit) {
      const mappedData: QuizLessonFormValues = {
        title: lessonToEdit.title,
        questions:
          lessonToEdit.questions?.map((question: Question) => {
            let processedDescription = question.description || "";

            const wordMatches = [...processedDescription.matchAll(/\[word\]/g)];

            wordMatches.forEach((match, index) => {
              const displayOrder = index + 1;
              const option = question.options?.find((opt) => opt.displayOrder === displayOrder);

              if (option) {
                const buttonHtml = `<button type="button" class="bg-primary-200 text-white px-4 rounded-xl cursor-pointer align-baseline">
                  ${option.optionText} X
                </button>`;

                processedDescription = processedDescription.replace(match[0], buttonHtml);
              }
            });

            return {
              id: question.id,
              type: question.type as QuestionType,
              description: processedDescription || undefined,
              photoS3Key: question.photoS3Key || undefined,
              photoQuestionType: question.photoQuestionType || undefined,
              title: question.title,
              options: question.options?.map((option: QuestionOption) => ({
                id: option.id,
                optionText: option.optionText,
                isCorrect: option.isCorrect,
                displayOrder: option.displayOrder,
              })),
            };
          }) || [],
      };

      reset(mappedData);
    }
  }, [lessonToEdit, reset]);

  const onDelete = async () => {
    if (!chapterToEdit?.id || !lessonToEdit?.id) {
      console.error("Course ID or Chapter ID is missing.");
      return;
    }

    try {
      await deleteLesson({ chapterId: chapterToEdit?.id, lessonId: lessonToEdit.id });
      queryClient.invalidateQueries({
        queryKey: [COURSE_QUERY_KEY, { id: courseId }],
      });
      setContentTypeToDisplay(ContentTypes.EMPTY);
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  const onSubmit = async (values: QuizLessonFormValues) => {
    if (!chapterToEdit) {
      return;
    }

    const updatedQuestions = values.questions.map((question) => {
      if (question.type === QuestionType.FILL_IN_THE_BLANKS && question.description) {
        return {
          ...question,
          description: question.description.replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, "[word]"),
        };
      }
      return question;
    });

    try {
      if (lessonToEdit) {
        await updateQuizLesson({
          data: { ...values, questions: updatedQuestions, type: LessonType.QUIZ },
          lessonId: lessonToEdit.id,
        });
      } else {
        await createQuizLesson({
          data: {
            ...values,
            questions: updatedQuestions,
            type: LessonType.QUIZ,
            chapterId: chapterToEdit.id,
          },
        });
      }
      setContentTypeToDisplay(ContentTypes.EMPTY);

      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY, { id: courseId }] });
    } catch (error) {
      console.error("Error creating text block:", error);
    }
  };

  return { form, onSubmit, onDelete };
};
