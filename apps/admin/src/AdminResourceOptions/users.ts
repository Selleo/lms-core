import { Before, ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { setColumnsPosition } from "../utils/getColumnsPosition.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { adminLikeRoles } from "./common/consts/selectOptions/adminLikeRoles.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

export const filterNonStudentUsers: Before = async (request) => {
  const { query = {} } = request;
  const newQuery = { ...query };

  if (newQuery["filters.role"]) {
    const roleFilter = newQuery["filters.role"].split(",");
    const uniqueRoleFilter = [...new Set(roleFilter)];

    const nonStudentRoles = uniqueRoleFilter.filter(
      (role) => role !== "student",
    );

    if (nonStudentRoles.length > 0) {
      newQuery["filters.role"] = nonStudentRoles.join(",");
    } else {
      newQuery["filters.role"] = "admin,tutor";
    }
  } else {
    newQuery["filters.role"] = "admin";
  }

  request.query = newQuery;
  return request;
};

export const usersConfigOptions: ResourceOptions = {
  filterProperties: ["first_name", "last_name", "email", "status", "role"],
  showProperties: ["first_name", "last_name", "email", "role", "status"],
  listProperties: ["first_name", "last_name", "email", "role", "status"],
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
      availableValues: [...adminLikeRoles],
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
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: [...statusOptions],
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
      before: [statusFilterBeforeAction, filterNonStudentUsers],
    },
  },
};
