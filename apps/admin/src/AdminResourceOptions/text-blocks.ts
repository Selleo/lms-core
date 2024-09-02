import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";

export const textBlocksConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  properties: {
    body: {
      type: "richtext",
    },
    status: {
      availableValues: [...stateOptions],
    },
    created_at: {
      position: 7,
      isVisible: {
        edit: false,
        list: true,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    updated_at: {
      position: 8,
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
    },
  },
};
