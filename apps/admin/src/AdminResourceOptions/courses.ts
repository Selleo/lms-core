import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  Before,
  ResourceOptions,
} from "adminjs";

const excludeNotActiveCourses: Before = async (request) => {
  const { query = {} } = request;
  const newQuery: { [key: string]: "true" | "false" } = {
    ...query,
    "filters.archived": query["filters.archived"] === "true" ? "true" : "false",
  };
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
      if (!record.params.archived) throw new Error("Record is already active");

      await resource.update(record.id(), { archived: false });
    }
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: "Record has been activated successfully",
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
        message: `There was an error activating the record:\n\n ${error.message}`,
        type: "error",
      },
    };
  }
};

export const coursesConfigOptions: ResourceOptions = {
  actions: {
    list: {
      before: [excludeNotActiveCourses],
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
      isAccessible: true,
      isVisible: (context) => {
        return !context.record?.params?.archived;
      },
    },
    unarchive: {
      actionType: "record",
      component: false,
      guard: "Do you really want to archive this record?",
      handler: unarchiveAction,
      icon: "Unlock",
      isAccessible: true,
      isVisible: (context) => {
        return context.record?.params?.archived;
      },
    },
  },
  filterProperties: ["status", "category_id", "archived"],
  properties: {
    id: {
      position: 1,
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    title: {
      position: 2,
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      position: 3,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    category_id: {
      position: 4,
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    status: {
      position: 5,
      isVisible: {
        list: true,
        filter: true,
        show: true,
        edit: false,
      },
      isSortable: true,
      availableValues: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
    },
    archived: {
      position: 6,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: true,
      },
      isDisabled: true,
      availableValues: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      isSortable: false,
    },
    image_url: {
      position: 11,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    author_id: {
      position: 10,
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    price_in_cents: {
      position: 9,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    created_at: {
      position: 7,
      isVisible: {
        edit: false,
        list: true,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    updated_at: {
      position: 8,
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
  },
};
