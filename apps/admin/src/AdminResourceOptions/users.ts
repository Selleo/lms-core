import { setColumnsPosition } from "../utils/getColumnsPosition.js";

export const usersConfigOptions = {
  options: {
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
    },
  },
};
