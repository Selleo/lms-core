import { ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { beforeCreateCategory } from "./common/actions/before/createCategory.js";
import { beforeUpdateCategory } from "./common/actions/before/updateCategory.js";

export const categoriesConfigOptions: ResourceOptions = {
  navigation: {
    name: null,
    icon: "List",
  },
  actions: {
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    ...archivingActions,
    new: {
      before: [beforeCreateCategory],
    },
    edit: {
      before: [beforeUpdateCategory],
    },
  },
  editProperties: ["title"],
  filterProperties: ["title", "status"],
  listProperties: ["title", "created_at", "status"],
  showProperties: ["title", "created_at", "updated_at", "status"],
  properties: {
    archived: {
      isRequired: false,
    },
    status: {
      components: {
        list: Components.ArchiveList,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: statusOptions,
      },
    },
    title: {
      isRequired: false,
    },
  },
};
