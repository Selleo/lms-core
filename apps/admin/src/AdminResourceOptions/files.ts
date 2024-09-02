import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";

export const filesConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  properties: {
    type: {
      availableValues: [
        { value: "presentation", label: "Presentation" },
        { value: "external_presentation", label: "External Presentation" },
        { value: "video", label: "Video" },
        { value: "external_video", label: "External Video" },
      ],
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
