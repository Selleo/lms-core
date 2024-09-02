import { ResourceOptions } from "adminjs";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";

export const lessonsConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  properties: {
    description: {
      type: "richtext",
    },
  },
};
