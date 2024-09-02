import { archivingActions } from "./common/archivingActions.js";
import { Components } from "../components/index.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";

export const lessonsConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  actions: {
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
  properties: {
    state: {
      isVisible: {
        filter: true,
        show: true,
        edit: true,
      },
      isSortable: true,
      availableValues: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
    },
    status: {
      components: {
        list: Components.CategoriesListShow,
        show: Components.CategoriesListShow,
        filter: Components.StatusFilter,
      },
      isVisible: {
        edit: false,
        show: true,
        filter: true,
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
        filter: false,
      },
      isSortable: false,
    },
    created_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
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
        filter: true,
      },
      isSortable: true,
    },
    updated_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
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
        filter: false,
      },
      isSortable: false,
    },
  },
};
