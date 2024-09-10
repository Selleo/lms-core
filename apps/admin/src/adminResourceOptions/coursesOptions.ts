import type { ResourceOptions } from "adminjs";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { courseValidateBeforeAction } from "../AdminResourceOptions/common/actions/before/courseValidate.js";

export const coursesConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  actions: {
    list: {
      before: [statusFilterBeforeAction],
    },
    new: {
      before: courseValidateBeforeAction,
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
    "lessons",
    "state",
    "file",
    "price_in_cents",
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
    "file",
    "author_id",
    "price_in_cents",
    "created_at",
    "updated_at",
    "status",
    "state",
  ],
  properties: {
    author_id: {
      components: {
        list: Components.AuthorId,
      },
      isSortable: true,
    },
    title: {
      isRequired: false,
      isSortable: true,
    },
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      isSortable: false,
      isRequired: false,
    },
    category_id: {
      isSortable: true,
      isRequired: false,
    },
    lessons: {
      type: "reference",
      reference: "lessons",
    },
    state: {
      availableValues: stateOptions,
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
    file: {
      components: {
        show: Components.PhotoPreview,
      },
    },
    price_in_cents: {
      type: "float",
      isSortable: false,
      isRequired: false,
    },
  },
};
