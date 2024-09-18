import {
  Before,
  ActionRequest,
  ActionContext,
  ValidationError,
  Filter,
} from "adminjs";
import { ValidationErrors } from "../../validationErrorsType.js";

export const beforeUpdateCategory: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { payload = {}, method } = request;
  if (method !== "post") return request;

  const { resource } = context;
  const editingRecordId = request.params.recordId;
  const title = payload?.title;
  const errors: ValidationErrors = {};

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

  const isTitleExistInDB = categories.some(
    (category) =>
      category.params.title.toLowerCase() === title.toLowerCase() &&
      category.id() !== editingRecordId,
  );

  if (isTitleExistInDB) {
    errors["title"] = {
      message: `Title: ${title} already exists`,
    };
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  request.payload = {
    ...request.payload,
  };

  return request;
};
