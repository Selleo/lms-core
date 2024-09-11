import { Components } from "../components/index.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { beforeCreateLesson } from "./common/actions/before/lessonCreate.js";
import { beforeUpdateLesson } from "./common/actions/before/udpateLesson.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { afterUpdateLesson } from "./common/actions/after/updateLesson.js";
import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { tempAddUrl } from "./common/actions/before/tempAddUrl.js";

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
      before: [beforeCreateLesson, addAuthorId, tempAddUrl],
    },
    edit: {
      before: [beforeUpdateLesson],
      after: [afterUpdateLesson],
    },
    ...archivingActions,
  },
  editProperties: ["title", "description", "state", "file", "lesson_items"],
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
    "author_id",
    "created_at",
    "updated_at",
    "state",
    "status",
    "file",
    "lesson_items",
  ],
  properties: {
    state: {
      isSortable: true,
      availableValues: stateOptions,
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
      type: "reference",
      reference: "lesson_items",
    },
    created_at: {},
    updated_at: {},
    author_id: {},
    file: {
      components: {
        show: Components.PhotoPreview,
      },
    },
  },
};