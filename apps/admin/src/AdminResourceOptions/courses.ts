import { Before, ResourceOptions } from "adminjs";
import { archiveActions } from "./common/archivingActions.js";

const excludeNotActiveCourses: Before = async (request) => {
  const { query = {} } = request;
  const newQuery: { [key: string]: "true" | "false" } = {
    ...query,
    "filters.archived": query["filters.archived"] === "true" ? "true" : "false",
  };
  request.query = newQuery;

  return request;
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
    ...archiveActions,
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
