import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { fileTypeOptions } from "./common/consts/selectOptions/fileTypeOptions.js";
import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { beforeCreateOrUpdateFiles } from "./common/actions/before/createOrUpdateFiles.js";
import { tempAddUrl } from "./common/actions/before/tempAddUrl.js";

export const filesConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  actions: {
    new: {
      before: [beforeCreateOrUpdateFiles, addAuthorId, tempAddUrl],
    },
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    edit: {
      before: [beforeCreateOrUpdateFiles],
    },
    ...archivingActions,
  },
  editProperties: ["title", "type", "state", "file", "archived"],
  filterProperties: ["type", "created_at", "state", "status"],
  listProperties: ["title", "author_id", "type", "state", "status"],
  showProperties: [
    "title",
    "author_id",
    "created_at",
    "updated_at",
    "type",
    "state",
    "status",
    "file",
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
    file: {
      components: {
        show: Components.PhotoPreview,
      },
      isRequired: true,
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
    type: {
      availableValues: fileTypeOptions,
      isRequired: false,
    },
  },
};