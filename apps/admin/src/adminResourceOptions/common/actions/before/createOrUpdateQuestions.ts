import { type ActionRequest, type Before, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateOrUpdateQuestions: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: ValidationErrors = {};
  const { question_type, question_body, state } = payload;

  if (!question_type) {
    errors.question_type = { message: "Please provide type of the question" };
  }

  if (!question_body || question_body === "<p></p>") {
    errors.question_body = { message: "Please provide question body" };
  }

  if (question_body?.length > 2000) {
    errors.question_body = {
      message: `Question body must be no more than 2000 characters.`,
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
