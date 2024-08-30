import { Before, ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { setColumnsPosition } from "../utils/getColumnsPosition.js";

const customBefore: Before = (request) => {
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

export const usersConfigOptions: ResourceOptions = {
  filterProperties: ["first_name", "last_name", "email", "status"],
  properties: {
    ...setColumnsPosition(["first_name", "last_name", "email"]),
    created_at: {
      isVisible: {
        edit: false,
        list: false,
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
    id: {
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
    },
    role: {
      availableValues: [
        { value: "admin", label: "Admin" },
        { value: "tutor", label: "Tutor" },
      ],
    },
    status: {
      type: "boolean",
      isVisible: {
        list: true,
        filter: true,
        show: true,
        edit: false,
      },
      components: {
        list: Components.StatusListValue,
        show: Components.ArchiveShow,
        filter: Components.ArchiveFilter,
      },
    },
    archived: {
      isVisible: {
        list: false,
        filter: false,
        show: false,
        edit: true,
      },
    },
  },
  actions: {
    list: {
      before: [customBefore],
    },
  },
};
