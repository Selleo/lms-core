//temporary work around to allow creating resources with file upload
import type { ActionRequest, Before } from "adminjs";
export const tempAddUrl: Before = async (request: ActionRequest) => {
  request.payload = {
    ...request.payload,
    url: "",
  };

  return request;
};
