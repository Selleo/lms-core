import { ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { setColumnsPosition } from "../utils/getColumnsPosition.js";
import { adminLikeRoles } from "./common/consts/selectOptions/adminLikeRoles.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { nonAdminRoles } from "./common/consts/selectOptions/nonAdminRoles.js";

export const usersConfigOptions: ResourceOptions = {
  ...noParentNavigation,
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
      availableValues: [...adminLikeRoles, ...nonAdminRoles],
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
      before: [statusFilterBeforeAction],
    },
  },
};
