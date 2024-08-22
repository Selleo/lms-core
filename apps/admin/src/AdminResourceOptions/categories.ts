import { Before, ResourceWithOptions } from "adminjs";
import { Components } from "../components/components.bundler.js";

const excludeNotActiveCategories: Before = async (request) => {
  const { query = {} } = request;
  const newQuery = {
    ...query,
    filters: {
      archived: false,
    },
  };

  request.query = newQuery;

  return request;
};

export const categoriesConfigOptions: Pick<ResourceWithOptions, "options"> = {
  options: {
    actions: {
      list: {
        before: [excludeNotActiveCategories],
      },
    },
    properties: {
      created_at: {
        type: "datetime",
        isVisible: {
          edit: false,
          list: true,
          show: true,
          filter: false,
        },
      },
      updated_at: {
        type: "datetime",
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      archived: {
        type: "boolean",
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: true,
        },
      },
      id: {
        type: "uuid",
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      status: {
        type: "string",
        components: {
          list: Components.Status,
          show: Components.Status,
        },
        isVisible: {
          edit: false,
          list: true,
          show: true,
          filter: false,
        },
      },
    },
  },
};
