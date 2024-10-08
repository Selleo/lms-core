import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { beforeCreateOrUpdateTextBlocks } from "./common/actions/before/createOrUpdateTextBlocks.js";
import { Components } from "../components/index.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

export const textBlocksConfigOptions: ResourceOptions = {
  parent: {
    name: "lesson-items",
    icon: "Box",
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
      before: [beforeCreateOrUpdateTextBlocks, addAuthorId],
    },
    edit: {
      before: [beforeCreateOrUpdateTextBlocks],
    },
    ...archivingActions,
  },
  editProperties: ["title", "body", "counter", "state"],
  filterProperties: ["created_at", "state", "status"],
  listProperties: ["title", "body", "state", "status"],
  showProperties: [
    "title",
    "body",
    "author_id",
    "created_at",
    "updated_at",
    "state",
    "status",
  ],
  properties: {
    body: {
      type: "richtext",
      isRequired: false,
    },
    counter: {
      components: {
        edit: Components.BodyTextCounter,
      },
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
    state: {
      availableValues: stateOptions,
      isRequired: false,
    },
    title: {
      isRequired: false,
    },
  },
};
