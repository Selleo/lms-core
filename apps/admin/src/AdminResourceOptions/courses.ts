import { Before, ResourceOptions } from "adminjs";
import { archiveActions } from "./common/archivingActions.js";
import { Components } from "../components/index.js";

const excludeNotActiveCourses: Before = async (request) => {
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
    state: {
      position: 5,
      isVisible: {
        list: true,
        filter: true,
        show: true,
        edit: true,
      },
      isSortable: true,
      availableValues: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
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
    archived: {
      isRequired: false,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
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
      components: {
        list: Components.AuthorId,
      },
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
