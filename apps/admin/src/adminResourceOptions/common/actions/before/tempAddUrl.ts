//temporary work around to allow creating resources with file upload
import type { ActionRequest, Before } from "adminjs";
export const tempAddUrl =
  (fieldName: "url" | "image_url"): Before =>
  async (request: ActionRequest) => {
    request.payload = {
      ...request.payload,
      [fieldName]: "",
    };

    return request;
  };
