import { Question } from "~/modules/Courses/Lesson/LessonItems/Question";

import type { GetLessonByIdResponse } from "~/api/generated-api";

type Questions = NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"];

type QuestionsProps = {
  questions: Questions;
};

export const Questions = ({ questions }: QuestionsProps) => {
  return questions.map((question: Questions[number]) => {
    if (!question) return null;

    return (
      <Question
        key={question.id}
        lessonItemId={question.id}
        content={question}
        lessonType="quiz"
        isCompleted={false}
        updateLessonItemCompletion={() => console.log("TODO: update Lesson Item Completion")}
      />
    );
  });
};
