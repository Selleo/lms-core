import {
  Before,
  ActionRequest,
  ActionContext,
  ValidationError,
  Filter,
} from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeCreateCategory: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { resource } = context;
  const errors: ValidationErrors = {};
  const title = request?.payload?.title;

  if (!title || title?.length < 1) {
    errors["title"] = {
      message: "Title is required",
    };
  }

  if (title?.length >= 100) {
    errors["title"] = {
      message: "Title must be no more than 100 characters",
    };
  }

  const filter = new Filter({ title }, resource);
  const categories = await resource.find(filter, {});

  const isTitleExist = categories.some(
    (category) => category.params.title.toLowerCase() === title.toLowerCase(),
  );

  if (isTitleExist) {
    errors["title"] = {
      message: `Title: ${title} already exists`,
    };
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return request;
};
