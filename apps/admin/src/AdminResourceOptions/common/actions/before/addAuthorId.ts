import type { ActionContext, ActionRequest, Before } from "adminjs";

export const addAuthorId: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  request.payload = {
    ...request.payload,
    author_id: context.currentAdmin?.id,
  };

  return request;
};
