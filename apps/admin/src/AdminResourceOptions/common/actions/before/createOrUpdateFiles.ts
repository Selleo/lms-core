import { type ActionRequest, type Before, ValidationError } from "adminjs";

export const beforeCreateOrUpdateFiles: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: { [key: string]: { message: string } } = {};
  const { type, state } = payload;

  if (!type) {
    errors.type = { message: "Please provide type of the file" };
  }

  if (!state) {
    errors.state = { message: "Please provide a state" };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
