import { type ActionRequest, type Before, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateOrUpdateQuestionAnswer: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: ValidationErrors = {};
  const { option_text, is_correct } = payload;

  if (!option_text) {
    errors.option_text = { message: "Please provide option text" };
  }

  if (option_text?.length > 100) {
    errors.option_text = {
      message: `Option text must be no more than 100 characters.`,
    };
  }

  if (!is_correct) {
    request.payload = {
      ...request.payload,
      is_correct: false,
    };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
