import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  Before,
  Filter,
  ResourceWithOptions,
  ValidationError,
} from "adminjs";
import { Components } from "../components/index.js";

const excludeNotActiveCategories: Before = async (request) => {
  const { query = {} } = request;

  const mappedStatusFilter =
    query["filters.status"] === "true" ? "true" : "false";

  const newQuery: { [key: string]: "true" | "false" } = {
    ...query,
    "filters.archived": mappedStatusFilter,
  };

  delete newQuery["filters.status"];
  request.query = newQuery;

  return request;
};

const archiveAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  const { currentAdmin, record, resource } = context;
  try {
    if (record) {
      if (record.params.archived) throw new Error("Record is already archived");

      await resource.update(record.id(), { archived: true });
    }
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: "Record has been archived successfully",
        type: "success",
      },
      redirectUrl: context.h.resourceUrl({
        resourceId: resource._decorated?.id() || resource.id(),
      }),
    };
  } catch (error) {
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: `There was an error archiving the record:\n\n ${error.message}`,
        type: "error",
      },
    };
  }
};

const unarchiveAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  const { currentAdmin, record, resource } = context;
  try {
    if (record) {
      if (!record.params.archived)
        throw new Error("Record is already archived");

      await resource.update(record.id(), { archived: false });
    }
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: "Record has been unarchived successfully",
        type: "success",
      },
      redirectUrl: context.h.resourceUrl({
        resourceId: resource._decorated?.id() || resource.id(),
      }),
    };
  } catch (error) {
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: `There was an error unarchiving the record:\n\n ${error.message}`,
        type: "error",
      },
    };
  }
};

const beforeCreate: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { resource } = context;
  const title = request?.payload?.title;

  if (!title || title?.length < 1) {
    throw new ValidationError({
      title: { message: "Title is required" },
    });
  }

  const filter = new Filter({ title }, resource);
  const categories = await resource.find(filter, {});

  const isTitleExist = categories.some(
    (category) => category.params.title.toLowerCase() === title.toLowerCase(),
  );

  if (isTitleExist) {
    throw new ValidationError({
      title: { message: `Title: ${title} already exists` },
    });
  }

  return request;
};

const beforeUpdate: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { resource } = context;
  const editingRecordId = request.params.recordId;
  const title = request?.payload?.title;

  if (title?.length < 1) {
    throw new ValidationError({
      title: { message: "Title is required" },
    });
  }

  const filter = new Filter({ title }, resource);
  const categories = await resource.find(filter, {});

  const isTitleExistInDB = categories.some(
    (category) =>
      category.params.title.toLowerCase() === title.toLowerCase() &&
      category.id() !== editingRecordId,
  );

  if (isTitleExistInDB) {
    throw new ValidationError({
      title: { message: `Title: ${title} already exists` },
    });
  }

  return request;
};

export const categoriesConfigOptions: Pick<ResourceWithOptions, "options"> = {
  options: {
    actions: {
      list: {
        before: [excludeNotActiveCategories],
      },
      delete: {
        isAccessible: false,
        isVisible: false,
      },
      archive: {
        actionType: "record",
        component: false,
        guard: "Do you really want to archive this record?",
        handler: archiveAction,
        icon: "Archive",
        isAccessible: ({ record }) => !record?.params.archived,
        isVisible: true,
      },
      unarchive: {
        actionType: "record",
        component: false,
        guard: "Do you really want to unarchive this record?",
        handler: unarchiveAction,
        icon: "Archive",
        isAccessible: ({ record }) => record?.params.archived,
        isVisible: true,
      },
      new: {
        before: [beforeCreate],
      },
      edit: {
        before: [beforeUpdate],
      },
    },
    properties: {
      title: {
        isRequired: false,
      },
      created_at: {
        isVisible: {
          edit: false,
          list: true,
          show: true,
          filter: false,
        },
      },
      updated_at: {
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      archived: {
        isRequired: false,
        isVisible: {
          edit: true,
          list: false,
          show: true,
          filter: false,
        },
      },
      id: {
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      status: {
        components: {
          list: Components.CategoriesListShow,
          show: Components.CategoriesListShow,
          filter: Components.StatusFilter,
        },
        isVisible: {
          edit: false,
          list: true,
          show: true,
          filter: true,
        },
      },
    },
  },
};
