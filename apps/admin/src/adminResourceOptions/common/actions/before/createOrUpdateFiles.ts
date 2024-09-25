import {
  ActionContext,
  type ActionRequest,
  type Before,
  ValidationError,
} from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateOrUpdateFiles: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: ValidationErrors = {};
  const { title, type, state } = payload;
  const isFile = context?.["adminjs-upload"]?.file?.length;

  if (!title) {
    errors.title = { message: "Please provide title of the file" };
  }

  if (title?.length > 100) {
    errors.title = {
      message: `Title must be no more than 100 characters.`,
    };
  }

  if (!type) {
    errors.type = { message: "Please provide type of the file" };
  }

  if (!state) {
    errors.state = { message: "Please provide a state" };
  }

  if (!isFile) {
    errors.type = { message: "Please upload a file below!" };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
