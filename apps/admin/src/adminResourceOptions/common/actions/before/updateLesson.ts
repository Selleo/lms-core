import { Before, ActionRequest, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeUpdateLesson: Before = async (request: ActionRequest) => {
  const { payload } = request;
  const errors: ValidationErrors = {};

  if (payload?.title?.length < 3) {
    errors["title"] = {
      message: "Title is required",
    };
  }

  if (payload?.title?.length > 100) {
    errors["title"] = {
      message: `Title must be no more than 100 characters. ${payload?.title?.length}/100 characters`,
    };
  }

  if (payload?.description?.length > 1000) {
    errors["description"] = {
      message: `Description must be no more than 1000 characters. ${payload?.description?.length}/1000 characters`,
    };
  }

  if (payload?.state === "published") {
    if (payload.archived) {
      errors["archived"] = {
        message: "You can't publish an archived lesson",
      };
    }

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
