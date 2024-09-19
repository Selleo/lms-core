import { type ActionRequest, type Before, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateOrUpdateTextBlocks: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: ValidationErrors = {};
  const { body, state, title } = payload;

  if (!title) {
    errors.title = { message: "Please provide title of the text block" };
  }

  if (title?.length > 100) {
    errors.title = {
      message: `Title must be no more than 100 characters.`,
    };
  }

  if (!body || body === "<p></p>") {
    errors.body = { message: "Please provide body of the text block" };
  }

  if (body?.length > 2000) {
    errors.body = {
      message: `Body must be no more than 2000 characters.`,
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
