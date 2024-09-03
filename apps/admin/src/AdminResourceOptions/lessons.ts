import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

export const lessonsConfigOptions: ResourceOptions = {
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
  listProperties: [
    "title",
    "state",
    "created_at",
    "author_id",
    "status",
    "lesson_items",
  ],
  filterProperties: ["title", "status", "state"],
  properties: {
    state: {
      isVisible: {
        show: true,
        edit: true,
      },
      isSortable: true,
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
      isVisible: {
        edit: false,
        show: true,
      },
    },
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      isVisible: {
        edit: true,
        show: true,
      },
      isSortable: false,
    },
    created_at: {
      isVisible: {
        edit: false,
        show: true,
      },
      isSortable: true,
    },
    author_id: {
      components: {
        list: Components.AuthorId,
      },
      isVisible: {
        edit: true,
        show: true,
      },
      isSortable: true,
    },
    updated_at: {
      isVisible: {
        edit: false,
        show: true,
      },
      isSortable: false,
    },
    lesson_items: {
      components: {
        list: Components.LessonItems,
      },
      isVisible: {
        edit: false,
        show: true,
      },
      isSortable: false,
    },
  },
};
