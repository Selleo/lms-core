import { Before, ActionRequest, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateLesson: Before = async (request: ActionRequest) => {
  const { payload } = request;
  const errors: ValidationErrors = {};

  if (!payload?.title?.length) {
    errors["title"] = {
      message: "Title is required",
    };
  }

  if (payload?.title?.length < 5) {
    errors["title"] = {
      message: `Title must be more than 5 characters. ${payload?.title?.length}`,
    };
  }

  if (payload?.title?.length > 100) {
    errors["title"] = {
      message: `Title must be no more than 100 characters. ${payload?.title?.length}/100 characters`,
    };
  }

  if (payload?.description?.length > 1000) {
    errors["description"] = {
      message: `Description must be no more than 100 characters. ${payload?.description?.length}/100 characters`,
    };
  }

  if (payload?.state === "published") {
    if (!payload?.description || payload?.description < 30) {
      errors["description"] = {
        message:
          "Description is required when the lesson is in 'published' state and be more than 30 characters`",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return request;
};
