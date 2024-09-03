import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { fileTypeOptions } from "./common/consts/selectOptions/fileTypeOptions.js";

export const filesConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  actions: {
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    ...archivingActions,
  },
  listProperties: ["created_at", "type", "state", "status"],
  properties: {
    type: {
      availableValues: [...fileTypeOptions],
    },
    status: {
      components: {
        list: Components.ArchiveList,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: [...statusOptions],
      },
      isVisible: {
        edit: false,
        show: true,
        filter: true,
      },
    },
    state: {
      availableValues: [...stateOptions],
    },
    archived: {
      isRequired: false,
      isVisible: {
        edit: true,
        show: true,
        filter: false,
      },
    },
    created_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    updated_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
      },
    },
  },
};
