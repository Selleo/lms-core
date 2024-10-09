import { ResourceOptions } from "adminjs";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { tempAddUrl } from "./common/actions/before/tempAddUrl.js";
import { beforeCreateCourse } from "./common/actions/before/createCourse.js";
import { beforeUpdateCourse } from "./common/actions/before/updateCourse.js";
import { addResourceId } from "./common/actions/before/addResourceId.js";

export const coursesConfigOptions: ResourceOptions = {
  navigation: {
    name: null,
    icon: "BookOpen",
  },
  actions: {
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    new: {
      before: [
        beforeCreateCourse,
        addAuthorId,
        tempAddUrl("image_url"),
        addResourceId,
      ],
    },
    edit: {
      before: [beforeUpdateCourse],
    },
    ...archivingActions,
  },
  editProperties: [
    "title",
    "description",
    "category_id",
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
    "author_id",
    "price_in_cents",
    "created_at",
    "updated_at",
    "status",
    "file",
    "lessons",
  ],
  properties: {
    title: {
      isRequired: false,
    },
    category_id: {
      isRequired: false,
    },
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
      isRequired: false,
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
    price_in_cents: {
      isRequired: false,
    },
    file: {
      components: {
        show: Components.PhotoPreview,
      },
    },
    lessons: {
      components: {
        show: Components.CourseLessonsShow,
      },
    },
  },
};
