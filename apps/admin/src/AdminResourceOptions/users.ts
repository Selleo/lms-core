import { ResourceOptions } from "adminjs";
import { Components } from "../components/components.js";

export const usersConfigOptions: ResourceOptions = {
  filterProperties: ["first_name", "last_name", "email", "archived"],
  showProperties: ["first_name", "last_name", "email", "role", "archived"],
  listProperties: ["first_name", "last_name", "email", "role", "archived"],
  properties: {
    first_name: {
      components: {
        edit: Components.Input,
      },
    },
    last_name: {
      components: {
        edit: Components.Input,
      },
    },
    email: {
      components: {
        edit: Components.Input,
      },
    },
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
      components: {
        edit: Components.Select,
      },
    },
    archived: {
      custom: {
        label: "Status",
        name: "archived",
        originalValue: "archived",
      },
      components: {
        list: Components.StatusListValue,
        filter: Components.ArchiveFilter,
      },
      isVisible: {
        list: true,
        filter: false,
        show: true,
        edit: true,
      },
    },
  },
};
