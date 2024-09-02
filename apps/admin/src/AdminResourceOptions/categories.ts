import {
  ActionContext,
  ActionRequest,
  Before,
  Filter,
  ResourceWithOptions,
  ValidationError,
} from "adminjs";
import { Components } from "../components/index.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

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

  if (title?.length >= 100) {
    throw new ValidationError({
      title: { message: "Title must be no more than 100 characters" },
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

  if (title?.length >= 100) {
    throw new ValidationError({
      title: { message: "Title must be no more than 100 characters" },
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
        before: [statusFilterBeforeAction],
      },
      delete: {
        isAccessible: false,
        isVisible: false,
      },
      ...archivingActions,
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
          filter: Components.FilterSelect,
        },
        props: {
          availableValues: [...statusOptions],
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
