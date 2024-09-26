import { Components } from "../components/index.js";
import { type ResourceOptions } from "adminjs";
import { adminLikeRoles } from "./common/consts/selectOptions/adminLikeRoles.js";
import { beforeCreateOrUpdateUser } from "./common/actions/before/createOrUpdateUser.js";
import { afterCreateUser } from "./common/actions/after/createUser.js";
import { nonAdminRoles } from "./common/consts/selectOptions/nonAdminRoles.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";

export const usersConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  actions: {
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    edit: {
      before: [beforeCreateOrUpdateUser],
      isAccessible: (context) => context?.currentAdmin?.role === "admin",
    },
    new: {
      before: [beforeCreateOrUpdateUser],
      after: [afterCreateUser],
      isAccessible: (context) => context?.currentAdmin?.role === "admin",
    },
    list: {
      before: [statusFilterBeforeAction],
    },
    ...archivingActions,
  },
  editProperties: ["first_name", "last_name", "email", "role"],
  filterProperties: ["first_name", "last_name", "email", "status", "role"],
  listProperties: ["first_name", "last_name", "email", "role", "status"],
  showProperties: [
    "first_name",
    "last_name",
    "email",
    "role",
    "created_at",
    "updated_at",
    "status",
  ],
  properties: {
    archived: {
      isRequired: false,
    },
    email: {
      isRequired: false,
    },
    first_name: {
      isRequired: false,
    },
    last_name: {
      isRequired: false,
    },
    role: {
      availableValues: [...adminLikeRoles, ...nonAdminRoles],
    },
    status: {
      type: "boolean",
      components: {
        list: Components.StatusListValue,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: statusOptions,
      },
    },
  },
};
