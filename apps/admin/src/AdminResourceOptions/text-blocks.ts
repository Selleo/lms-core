import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

export const textBlocksConfigOptions: ResourceOptions = {
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
  listProperties: ["created_at", "author_id", "state", "status"],
  properties: {
    body: {
      type: "richtext",
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
    author_id: {
      components: {
        list: Components.AuthorId,
      },
      isVisible: {
        edit: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    created_at: {
      position: 7,
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
