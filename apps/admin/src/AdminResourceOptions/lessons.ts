import { Components } from "../components/index.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { beforeCreateLesson } from "./common/actions/before/createLesson.js";
import { beforeUpdateLesson } from "./common/actions/before/udpateLesson.js";

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
    new: {
      before: [beforeCreateLesson],
    },
    edit: {
      before: [beforeUpdateLesson],
    },
    ...archivingActions,
  },
  editProperties: ["title", "description", "state", "archived"],
  filterProperties: ["title", "state", "status"],
  listProperties: [
    "title",
    "author_id",
    "lesson_items",
    "created_at",
    "state",
    "status",
  ],
  showProperties: [
    "title",
    "description",
    "lesson_items",
    "author_id",
    "created_at",
    "updated_at",
    "state",
    "status",
  ],
  properties: {
    state: {
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
    },
    archived: {
      isRequired: false,
    },
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      isSortable: false,
    },
    lesson_items: {
      components: {
        list: Components.LessonItems,
      },
      isSortable: false,
    },
    created_at: {},
    updated_at: {},
    image_url: {
      components: {
        edit: Components.PhotoUpload,
        show: Components.PhotoPreview,
      },
      isSortable: false,
      isRequired: false,
    },
    author_id: {},
  },
};
