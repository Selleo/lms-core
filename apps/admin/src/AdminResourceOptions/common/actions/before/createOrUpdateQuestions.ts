import { type ActionRequest, type Before, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateOrUpdateQuestions: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: ValidationErrors = {};
  const { question_type, question_body, solution_explanation, state } = payload;

  if (!question_type) {
    errors.question_type = { message: "Please provide type of the question" };
  }

  if (!question_body) {
    errors.question_body = { message: "Please provide question body" };
  }

  if (question_body?.length > 2000) {
    errors.question_body = {
      message: `Question body must be no more than 2000 characters.`,
    };
  }

  if (!solution_explanation || solution_explanation === "<p></p>") {
    errors.solution_explanation = {
      message: "Please provide solution explanation",
    };
  }

  if (solution_explanation?.length > 2000) {
    errors.solution_explanation = {
      message: `Solution explanation must be no more than 2000 characters.`,
    };
  }

  if (!state) {
    errors.state = { message: "Please provide a state" };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
