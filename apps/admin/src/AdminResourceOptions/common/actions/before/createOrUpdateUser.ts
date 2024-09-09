import {
  type ActionContext,
  type ActionRequest,
  type Before,
  Filter,
  ValidationError,
} from "adminjs";

export const beforeCreateOrUpdateUser: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { resource } = context;
  const { payload = {}, method } = request;

  if (method !== "post") return request;

  const errors: { [key: string]: { message: string } } = {};
  const { first_name, last_name, email, role } = payload;

  if (!first_name) {
    errors.first_name = { message: "Please provide your name" };
  }

  if (!last_name) {
    errors.last_name = { message: "Please provide your last name" };
  }

  if (!email) {
    errors.email = { message: "Please provide your email address" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.email = { message: "Please provide a valid email address" };
  }

  if (!role) {
    errors.role = { message: "Please select a role" };
  }

  const users = await resource.find(new Filter({ email }, resource), {});

  const isUserExist = users.some(
    ({ params }) =>
      params?.email?.toLowerCase() === email?.toLowerCase() &&
      params?.id !== payload?.id,
  );

  if (isUserExist) {
    errors.email = { message: `User with this email address already exists` };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
