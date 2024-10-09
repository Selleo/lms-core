import { type ActionRequest, type Before, ValidationError } from "adminjs";
import type { ValidationErrors } from "../../../common/validationErrorsType.js";

const addError = (errors: ValidationErrors, field: string, message: string) => {
  errors[field] = { message };
};

export const beforeUpdateCourse: Before = async (request: ActionRequest) => {
  if (!Object.keys(request.payload || {}).length) return request;

  const { title, description, category_id, state, price_in_cents, currency } =
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

    if (!category_id) {
      addError(errors, "category_id", "Please select a category");
    }
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

  if (!price_in_cents) {
    addError(errors, "price_in_cents", "Please provide the price");
  }

  if (!currency) {
    addError(errors, "currency", "Please provide the currency");
  }

  const currencyRegex = /^[A-Z]{3}$/;

  if (!currencyRegex.test(currency)) {
    addError(
      errors,
      "currency",
      "Currency must be a capitalized 3-letter code",
    );
  }

  if (
    typeof Number(price_in_cents) !== "number" ||
    isNaN(Number(price_in_cents))
  ) {
    addError(errors, "price_in_cents", "Price must be a number");
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
