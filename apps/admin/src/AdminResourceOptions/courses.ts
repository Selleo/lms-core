import { ResourceOptions } from "adminjs";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";

export const coursesConfigOptions: ResourceOptions = {
  ...noParentNavigation,
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
  editProperties: [
    "title",
    "description",
    "category_id",
    "state",
    "price_in_cents",
    "archived",
  ],
  filterProperties: ["category_id", "state", "status"],
  listProperties: [
    "title",
    "category_id",
    "author_id",
    "created_at",
    "state",
    "status",
  ],
  showProperties: [
    "title",
    "description",
    "category_id",
    "author_id",
    "price_in_cents",
    "created_at",
    "updated_at",
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
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      isSortable: false,
    },
    state: {
      availableValues: [...stateOptions],
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
  },
};
