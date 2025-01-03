import { Question } from "~/modules/Courses/Lesson/LessonItems/Question";

import type { GetLessonByIdResponse } from "~/api/generated-api";

type QuestionsProps = {
  questions: GetLessonByIdResponse["data"]["quizDetails"]["questions"];
};

export const Questions = ({ questions }: QuestionsProps) => {
  return questions.map(
    (question: GetLessonByIdResponse["data"]["quizDetails"]["questions"][number]) => {
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
    },
  );
};
