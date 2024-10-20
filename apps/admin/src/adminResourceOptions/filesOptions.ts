import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ResourceOptions,
} from "adminjs";
import { Components } from "../components/index.js";
import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { addResourceId } from "./common/actions/before/addResourceId.js";
import { beforeCreateOrUpdateFiles } from "./common/actions/before/createOrUpdateFiles.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { tempAddUrl } from "./common/actions/before/tempAddUrl.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { fileTypeOptions } from "./common/consts/selectOptions/fileTypeOptions.js";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

const handleExternalVideo = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  console.log("Raw payload:", request.payload);

  const url = request.payload?.url || request.payload?.file || "";

  const params = {
    ...request.payload,
    url: url,
  };

  console.log("Final params for creation/update:", params);

  const method = request.method === "post" ? "create" : "update";
  const recordId = request.params.recordId;

  let record;
  if (request.params.action === "new") {
    record = await context.resource.create(params);
  } else if (request.params.action === "edit" && recordId) {
    record = await context.resource.update(recordId, params);
  } else {
    throw new Error("Invalid method or missing recordId for update");
  }

  if (!record) {
    return {
      record: null,
      redirectUrl: context.h.resourceUrl({
        resourceId: context.resource._decorated?.id() || context.resource.id(),
      }),
      notice: {
        message: `Failed to ${method} an external video record`,
        type: "error",
      },
    };
  }

  console.log("Created/Updated record:", record);

  return {
    record,
    redirectUrl: context.h.resourceUrl({
      resourceId: context.resource._decorated?.id() || context.resource.id(),
    }),
    notice: {
      message: `Successfully ${method === "create" ? "created" : "updated"} an external video record`,
      type: "success",
    },
  };
};

export const filesConfigOptions: ResourceOptions = {
  parent: {
    name: "lesson-items",
    icon: "Box",
  },
  actions: {
    new: {
      handler: async (request, response, context) => {
        if (request.payload?.type === "external_video") {
          request.payload.url = context.externalVideoUrl || "";
          return handleExternalVideo(request, response, context);
        }
        return context.resource
          .decorate()
          .actions.new.handler(request, response, context);
      },
      before: [
        async (request, context) => {
          if (request.payload?.type === "external_video") {
            context.externalVideoUrl = request.payload.url;
            delete request.payload.url;
          }
          return request;
        },
        beforeCreateOrUpdateFiles,
        addAuthorId,
        tempAddUrl("url"),
        addResourceId,
      ],
      after: [
        // @ts-expect-error test
        async (response) => {
          return response;
        },
      ],
    },
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    edit: {
      handler: async (request, response, context) => {
        if (request.payload?.type === "external_video") {
          request.payload.url =
            context.externalVideoUrl || request.payload.url || "";
          return handleExternalVideo(request, response, context);
        }
        return context.resource
          .decorate()
          .actions.edit.handler(request, response, context);
      },

      before: [
        async (request, context) => {
          if (request.payload?.type === "external_video") {
            context.externalVideoUrl = request.payload.url;
            delete request.payload.url;
          }
          return request;
        },
        beforeCreateOrUpdateFiles,
      ],
    },
    ...archivingActions,
  },
  editProperties: ["title", "state", "type", "file", "archived"],
  filterProperties: ["type", "created_at", "state", "status"],
  listProperties: ["title", "author_id", "type", "state", "status"],
  showProperties: [
    "title",
    "author_id",
    "created_at",
    "updated_at",
    "type",
    "file",
    "state",
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
    file: {
      components: {
        edit: Components.DynamicFileInput,
        show: Components.FilesPreview,
      },
      isRequired: true,
    },
    url: {
      isVisible: {
        list: true,
        filter: true,
        show: true,
        edit: true,
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
    type: {
      availableValues: fileTypeOptions,
      isRequired: false,
    },
  },
};
