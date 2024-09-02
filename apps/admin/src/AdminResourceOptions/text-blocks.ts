import { ResourceOptions } from "adminjs";

export const textBlocksConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  properties: {
    body: {
      type: "richtext",
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
