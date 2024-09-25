import type { ActionRequest, Before } from "adminjs";

export const addResourceId: Before = async (request: ActionRequest) => {
  request.payload = {
    ...request.payload,
    id: crypto.randomUUID(),
  };

  return request;
};
