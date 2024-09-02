import { ResourceOptions } from "adminjs";

export const textBlocksConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  properties: {
    description: {
      type: "richtext",
    },
  },
};
