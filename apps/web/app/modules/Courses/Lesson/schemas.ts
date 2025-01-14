import { z } from "zod";

export const QuizFormSchema = z
  .object({
    briefResponses: z.record(z.string().min(1, "Answer cannot be empty")).optional(),
    detailedResponses: z.record(z.string().min(1, "Answer cannot be empty")).optional(),
    singleAnswerQuestions: z
      .record(z.record(z.string().min(1, "Answer cannot be empty").nullable()))
      .optional(),
    multiAnswerQuestions: z.record(z.record(z.string().nullable())).optional(),
    photoQuestionSingleChoice: z
      .record(z.record(z.string().min(1, "Answer cannot be empty").nullable()))
      .optional(),
    photoQuestionMultipleChoice: z.record(z.record(z.string().nullable())).optional(),
    trueOrFalseQuestions: z
      .record(z.record(z.string().min(1, "Answer cannot be empty").nullable()))
      .optional(),
    fillInTheBlanksText: z
      .record(z.record(z.string().min(1, "Answer cannot be empty").nullable()))
      .optional(),
    fillInTheBlanksDnd: z
      .record(z.record(z.string().min(1, "Answer cannot be empty").nullable()))
      .optional(),
  })
  .superRefine((data, ctx) => {
    const requiredFields = {
      multiple_choice: "multiAnswerQuestions",
      photo_question_multiple_choice: "photoQuestionMultipleChoice",
    };
    for (const [_, fieldName] of Object.entries(requiredFields)) {
      const fieldData = data[fieldName as keyof typeof data];
      if (fieldData) {
        Object.entries(fieldData).forEach(([questionId, answers]) => {
          const isValid = Object.values(answers).some(
            (value) => typeof value === "string" && value.trim() !== "",
          );
          if (!isValid) {
            ctx.addIssue({
              code: "custom",
              path: [fieldName, questionId],
              message: `At least one option must be selected for question ${questionId}.`,
            });
          }
        });
      }
    }

    const fillInTheBlanksDnd = data.fillInTheBlanksDnd;
    if (fillInTheBlanksDnd) {
      Object.entries(fillInTheBlanksDnd).forEach(([questionId, answer]) => {
        if (!answer) {
          ctx.addIssue({
            code: "custom",
            path: ["fillInTheBlanksDnd", questionId],
            message: `Answer cannot be empty for drag-and-drop question ${questionId}.`,
          });
        }
      });
    }

    const fillInTheBlanksText = data.fillInTheBlanksText;
    if (fillInTheBlanksText) {
      Object.entries(fillInTheBlanksText).forEach(([questionId, answer]) => {
        if (!answer) {
          ctx.addIssue({
            code: "custom",
            path: ["fillInTheBlanksText", questionId],
            message: `Answer cannot be empty for text question ${questionId}.`,
          });
        }
      });
    }
  });
