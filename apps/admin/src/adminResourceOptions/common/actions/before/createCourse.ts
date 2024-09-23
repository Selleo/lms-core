import { type ActionRequest, type Before, ValidationError } from "adminjs";
import type { ValidationErrors } from "../../validationErrorsType.js";

const addError = (errors: ValidationErrors, field: string, message: string) => {
  errors[field] = { message };
};

export const beforeCreateCourse: Before = async (request: ActionRequest) => {
  const { title, description, category_id, state, price_in_cents } =
    request?.payload ?? {};
  const errors: ValidationErrors = {};

  const isDraft = state === "draft";

  if (!isDraft) {
    if (!description) {
      addError(errors, "description", "Please provide the description");
    }

    if (description?.length > 1000) {
      addError(
        errors,
        "description",
        "Provided description is too long (max. 1000 characters)",
      );
    }

    if (!price_in_cents) {
      addError(errors, "price_in_cents", "Please provide the price in cents");
    }
  }

  if (!category_id) {
    addError(errors, "category_id", "Please select a category");
  }

  if (!title) {
    addError(errors, "title", "Please provide the title");
  }

  if (title?.length > 100) {
    addError(
      errors,
      "title",
      "Provided title is too long (max. 100 characters)",
    );
  }

  if (!state) {
    addError(errors, "state", "Please provide the state");
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
