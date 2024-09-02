import { ResourceOptions } from "adminjs";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";

export const lessonsConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  properties: {
    description: {
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
