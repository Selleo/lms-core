import { type ActionRequest, type Before, ValidationError } from "adminjs";

export const beforeCreateOrUpdateTextBlocks: Before = async (
  request: ActionRequest,
) => {
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: { [key: string]: { message: string } } = {};
  const { body, state } = payload;

  if (!body || body === "<p></p>") {
    errors.body = { message: "Please provide type of the file" };
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
