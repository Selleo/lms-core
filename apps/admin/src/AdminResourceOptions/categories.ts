import { Before, ResourceWithOptions } from "adminjs";
import { Components } from "../components/index.js";

const excludeNotActiveCategories: Before = async (request) => {
  const { query = {} } = request;

  const isStatusActive = query["filters.status"];

  const newQuery: { [key: string]: "true" | "false" } = {
    ...query,
    "filters.archived": isStatusActive === "true" ? "true" : "false",
  };

  delete newQuery["filters.status"];
  request.query = newQuery;

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
          edit: true,
          list: false,
          show: true,
          filter: false,
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
