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
  editProperties: ["type", "state", "archived"],
  filterProperties: ["type", "created_at", "state", "status"],
  listProperties: ["author_id", "created_at", "type", "state", "status"],
  showProperties: [
    "author_id",
    "created_at",
    "updated_at",
    "type",
    "state",
    "status",
  ],
  properties: {
    archived: {
      isRequired: false,
    },
    author_id: {
      components: {
        list: Components.AuthorId,
      },
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
    },
    state: {
      availableValues: [...stateOptions],
    },
    type: {
      availableValues: [...fileTypeOptions],
    },
  },
};
