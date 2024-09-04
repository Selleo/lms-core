import {
  ActionContext,
  ActionRequest,
  Before,
  Filter,
  ResourceOptions,
  ValidationError,
} from "adminjs";
import { Components } from "../components/index.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";

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

export const categoriesConfigOptions: ResourceOptions = {
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
    new: {
      before: [beforeCreate],
    },
    edit: {
      before: [beforeUpdate],
    },
  },
  editProperties: ["title", "archived"],
  filterProperties: ["title", "status"],
  listProperties: ["title", "created_at", "status"],
  showProperties: ["title", "created_at", "updated_at", "status"],
  properties: {
    title: {
      isRequired: false,
    },
    archived: {
      isRequired: false,
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
  },
};
