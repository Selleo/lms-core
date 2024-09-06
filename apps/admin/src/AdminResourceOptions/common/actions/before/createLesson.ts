import { Before, ActionRequest, ActionContext, ValidationError } from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateLesson: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { payload } = request;
  const errors: ValidationErrors = {};

  if (!payload?.title?.length) {
    errors["title"] = {
      message: "Title is required",
    };
  }

  if (payload?.title?.length > 100) {
    errors["title"] = {
      message: `Title must be no more than 100 characters. ${payload?.title?.length}/100 characters`,
    };
  }

  if (payload?.state === "published") {
    const requiredFieldsForPublished = ["image_url", "description"];
    requiredFieldsForPublished.forEach((field) => {
      if (!payload[field] || payload[field].length < 1) {
        errors[field] = {
          message: `${field} is required when the lesson is in 'published' state.`,
        };
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  request.payload = {
    ...request.payload,
    author_id: context.currentAdmin?.id,
  };

  return request;
};
